package br.com.brasilfighters;

import android.app.Activity;
import android.app.AlertDialog;
import android.widget.EditText;
import android.webkit.JavascriptInterface;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.webkit.WebViewAssetLoader;

public class MainActivity extends Activity {
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        WebView web = new WebView(this);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
        });
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface public void connectWifi() {
                runOnUiThread(() -> {
                    EditText input = new EditText(MainActivity.this);
                    input.setSingleLine(true);
                    input.setHint("http://192.168.../controle.html?room=...");
                    new AlertDialog.Builder(MainActivity.this).setTitle("Entrar na partida Wi-Fi")
                        .setMessage("Cole o endereço exibido no computador que está hospedando a partida.")
                        .setView(input).setNegativeButton("Cancelar", null)
                        .setPositiveButton("Conectar", (dialog, which) -> {
                            String address = input.getText().toString().trim();
                            if (address.startsWith("http://") && address.contains("/controle.html?room=")) web.loadUrl(address);
                        }).show();
                });
            }
        }, "AndroidApp");
        setContentView(web);
        web.loadUrl("https://appassets.androidplatform.net/index.html");
    }
}
