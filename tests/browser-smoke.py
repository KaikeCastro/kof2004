"""Optional real-browser checks. Requires Python Playwright and a Chromium binary.
Run with the server started: GAME_URL=http://127.0.0.1:3001 python tests/browser-smoke.py
The test bridge is injected into the HTTP response only; production has no test hooks.
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

URL=os.environ.get('GAME_URL','http://127.0.0.1:3000')
ARTIFACTS=Path(os.environ.get('GAME_ARTIFACTS','/tmp/brasil-fighters-checks'))
ARTIFACTS.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
    page=browser.new_page(viewport={'width':1024,'height':900})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    def ready(target):
        target.goto(URL,wait_until='domcontentloaded')
        target.wait_for_function('document.getElementById("loading").hidden')
    ready(page)
    assert page.locator('#title-screen').is_visible()
    page.screenshot(path=str(ARTIFACTS/'title.png'))
    page.keyboard.press('Enter')
    assert page.locator('.fighter-card').count()==8
    assert page.locator('#fight-button').is_disabled()
    for i in [0,1,2]:page.locator('.fighter-card').nth(i).click()
    assert page.locator('#fight-button').is_enabled()
    # Removing and replacing a member preserves explicit order and prevents duplicates.
    page.locator('#team-1 button').nth(1).click()
    assert page.locator('#fight-button').is_disabled()
    page.locator('.fighter-card').nth(1).click()
    page.screenshot(path=str(ARTIFACTS/'selection.png'))
    page.click('#fight-button')
    page.wait_for_timeout(5100)
    assert page.locator('#battle').is_visible()
    assert page.locator('#p1-team span').count()==3
    page.screenshot(path=str(ARTIFACTS/'battle.png'))
    page.keyboard.press('Escape')
    assert page.locator('#pause-overlay').is_visible()
    page.click('#resume-button')
    assert not page.locator('#pause-overlay').is_visible()
    page.click('#back-button')
    for width,height in [(390,844),(844,390)]:
        page.set_viewport_size({'width':width,'height':height})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'overflow at {width}'
        page.screenshot(path=str(ARTIFACTS/f'selection-{width}.png'))
    # A full match through real combat and normal input, with deterministic frame stepping.
    match=browser.new_page(viewport={'width':1024,'height':900},has_touch=True)
    match.on('pageerror',lambda error:errors.append(str(error)))
    def instrument(route):
        response=route.fetch()
        source=response.text()+"\nwindow.__matchCheck={state:()=>({screen,roundStage,players,teams,remaining,lanRoom,lanConnected}),tick:()=>{update(1/60);render();}};"
        route.fulfill(response=response,body=source)
    match.route('**/src/game.js',instrument)
    ready(match)
    match.click('#start-button')
    for i in [0,1,2]:match.locator('.fighter-card').nth(i).click()
    match.click('#mode-button')
    match.click('#fight-button')
    result=match.evaluate('''() => {
      const api=window.__matchCheck;
      function key(code,type){document.body.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true}));}
      let frames=0,seen=new Set();
      while(api.state().roundStage!=='finished' && frames++<18000){
        const state=api.state(),[a,b]=state.players;seen.add(b.index);
        let code=null;
        if(state.roundStage==='fight'){
          const distance=Math.abs(a.x-b.x);
          code=distance>105?(a.x<b.x?'KeyD':'KeyA'):(a.confirmed&&a.energy>=50?'KeyL':'KeyJ');
          key(code,'keydown');
        }
        api.tick();
        if(code)key(code,'keyup');
      }
      const s=api.state();
      return {frames,stage:s.roundStage,active:s.teams.map(t=>t.active),seen:[...seen],hp:s.players.map(f=>f.hp)};
    }''')
    assert result['stage']=='finished',result
    assert result['active']==[0,3],result
    assert result['seen']==[3,4,5],result
    assert match.locator('#result-title').inner_text()=='1P WINNER!'
    match.screenshot(path=str(ARTIFACTS/'team-victory.png'))
    match.click('#rematch-button')
    assert match.evaluate('window.__matchCheck.state().teams.every(t=>t.active===0)')
    assert match.evaluate('window.__matchCheck.state().players.every(f=>f.hp===100)')
    # The opposite side must also advance all three opponents correctly.
    reverse=match.evaluate('''() => {
      const api=window.__matchCheck;let frames=0,seen=new Set();
      while(api.state().roundStage!=='finished'&&frames++<18000){
        const s=api.state(),[b,a]=s.players;seen.add(b.index);let code=null;
        if(s.roundStage==='fight'){
          code=Math.abs(a.x-b.x)>105?(a.x<b.x?'ArrowRight':'ArrowLeft'):(a.confirmed&&a.energy>=50?'Digit3':'Digit1');
          document.body.dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));
        }
        api.tick();if(code)document.body.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
      }
      const s=api.state();return {stage:s.roundStage,active:s.teams.map(t=>t.active),seen:[...seen]};
    }''')
    assert reverse['stage']=='finished' and reverse['active']==[3,0],reverse
    assert reverse['seen']==[0,1,2],reverse
    assert match.locator('#result-title').inner_text()=='2P WINNER!'
    match.click('#rematch-button')
    tied=match.evaluate('''() => {
      const api=window.__matchCheck;let frames=0;
      while(api.state().roundStage!=='finished'&&frames++<20000)api.tick();
      const s=api.state();return {stage:s.roundStage,active:s.teams.map(t=>t.active)};
    }''')
    assert tied['stage']=='finished' and tied['active']==[3,3],tied
    assert match.locator('#result-title').inner_text()=='DRAW GAME'
    # Controlled full-gauge fixtures exercise keyboard-to-move wiring for all 16 powers.
    # The full-match assertions above build their meter normally, with no state overrides.
    for index in range(8):
        match.click('#back-button')
        match.click('#pick-p1')
        for _ in range(3):match.locator('#team-1 button').nth(0).click()
        for chosen in [index,(index+1)%8,(index+2)%8]:match.locator('.fighter-card').nth(chosen).click()
        assert match.locator('#move-list b').count()==2
        match.click('#fight-button')
        match.evaluate('for(let i=0;i<300;i++)window.__matchCheck.tick()')
        for button,action in [('n','strongPunch'),('b','strongKick'),('l','special'),('p','special2')]:
            match.evaluate('window.__matchCheck.state().players[0].energy=100')
            match.keyboard.press(button)
            match.evaluate('window.__matchCheck.tick()')
            actual=match.evaluate('window.__matchCheck.state().players[0].action')
            assert actual==action,(index,button,actual)
            match.evaluate('for(let i=0;i<100;i++)window.__matchCheck.tick()')
        match.keyboard.down('s')
        match.keyboard.press('b')
        match.evaluate('window.__matchCheck.tick()')
        assert match.evaluate('window.__matchCheck.state().players[0].stance')=='crouch'
        match.keyboard.up('s')
        match.evaluate('for(let i=0;i<100;i++)window.__matchCheck.tick()')
        match.keyboard.down('w')
        match.evaluate('window.__matchCheck.tick()')
        match.keyboard.press('n')
        match.evaluate('window.__matchCheck.tick()')
        assert match.evaluate('window.__matchCheck.state().players[0].stance')=='air'
        match.keyboard.up('w')
        match.evaluate('for(let i=0;i<100;i++)window.__matchCheck.tick()')
        match.evaluate('window.__matchCheck.state().players[0].energy=100')
        match.keyboard.press('q')
        match.evaluate('window.__matchCheck.tick()')
        assert match.evaluate('window.__matchCheck.state().players[0].maxTime>0')
        assert match.locator('#p1-max').is_visible()
        if index==0:match.screenshot(path=str(ARTIFACTS/'max-mode.png'))
        match.keyboard.press('l')
        match.evaluate('window.__matchCheck.tick()')
        assert match.evaluate('window.__matchCheck.state().players[0].action')=='special'
        assert match.evaluate('window.__matchCheck.state().players[0].energy')<=36
        match.evaluate('for(let i=0;i<100;i++)window.__matchCheck.tick()')
    # Directional motion through actual keyboard events, independent of shortcuts.
    match.evaluate('window.__matchCheck.state().players[0].energy=100')
    match.keyboard.down('s');match.evaluate('window.__matchCheck.tick()')
    match.keyboard.down('d');match.evaluate('window.__matchCheck.tick()')
    match.keyboard.up('s');match.evaluate('window.__matchCheck.tick()')
    match.keyboard.press('j');match.evaluate('window.__matchCheck.tick()')
    match.keyboard.up('d')
    assert match.evaluate('window.__matchCheck.state().players[0].action')=='special'
    # Touch buttons use the same action mapping on the primary screen.
    match.evaluate('for(let i=0;i<100;i++)window.__matchCheck.tick()')
    match.set_viewport_size({'width':390,'height':844})
    match.locator('[data-key="n"]').tap()
    match.evaluate('window.__matchCheck.tick()')
    assert match.evaluate('window.__matchCheck.state().players[0].action')=='strongPunch'
    assert match.evaluate('document.documentElement.scrollWidth <= innerWidth'),'battle controls overflow'
    match.screenshot(path=str(ARTIFACTS/'battle-mobile.png'))
    # LAN commands and second browser controller.
    match.click('#back-button')
    match.click('#lan-button')
    match.wait_for_function('window.__matchCheck.state().lanRoom!==null')
    room=match.evaluate('window.__matchCheck.state().lanRoom')
    guest=browser.new_page(viewport={'width':390,'height':844})
    guest.on('pageerror',lambda error:errors.append(str(error)))
    guest.goto(URL+'/controle.html?room='+room['code'])
    guest.wait_for_function('document.getElementById("status").textContent.includes("Conectado")')
    match.wait_for_function('window.__matchCheck.state().lanConnected')
    match.bring_to_front()
    match.click('#fight-button')
    match.evaluate('for(let i=0;i<300;i++)window.__matchCheck.tick()')
    for action in ['grab','dodge','strongPunch','strongKick','special','special2','max','down','block']:
        match.evaluate('window.__matchCheck.state().players[1].energy=100')
        guest.bring_to_front()
        button=guest.locator('[data-key="'+action+'"]')
        button.hover();guest.mouse.down()
        guest.wait_for_timeout(180)
        response=page.request.get(URL+'/lan/'+room['code']+'/input',headers={'X-Host-Token':room['host']}).json()
        assert response['guest'] and response['input'][action],response
        guest.mouse.up()
        guest.wait_for_timeout(180)
        if action not in ['down','block']:
            assert response['input']['presses'][action]>0
        match.bring_to_front()
        if match.locator('#pause-overlay').is_visible():match.click('#resume-button')
        match.evaluate('window.__matchCheck.tick()')
        if action in ['strongPunch','strongKick','special','special2']:
            assert match.evaluate('window.__matchCheck.state().players[1].action')==action,action
        if action=='max':assert match.evaluate('window.__matchCheck.state().players[1].maxTime>0')
        match.evaluate('for(let i=0;i<120;i++)window.__matchCheck.tick()')
    assert not errors,errors
    print('PASS: title, selection, order editing, battle, pause, 2 mobile layouts, full 3x3 wins for both sides, time-out draw, rematch and LAN grab/dodge.')
    print('PASS: four-button keyboard and touch controls, crouch/air normals, all 16 special shortcuts, directional motion, MAX UI and extended LAN inputs.')
    print('Match:',result)
    print('Screenshots:',ARTIFACTS)
    browser.close()
