/**
 * VAS - GAS API通信用ロジック (api.js)
 * GitHub Pages(静的ホスティング)から GAS の doPost を fetch で呼び出す。
 *
 * ★ Content-Type は text/plain にすること。
 *   application/json にすると CORS プリフライト(OPTIONS)が発生し、
 *   GASのWebアプリはOPTIONSに正しく応答できないため失敗する。
 *   GAS側の doPost は e.postData.contents を見るだけなので、
 *   中身がJSON文字列であれば text/plain でも問題なく動作する。
 */

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbwkpj51Z8FHf0ZIAtDxXBnN08UBQxgB-7m_OnPAXykYr5r3U2OXhuopdfe6OyM1xB5b/exec";

async function callGasAPI(action, data = {}) {
    try {
        const response = await fetch(GAS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ action, data })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[API Error]', error);
        return { success: false, message: error.message || String(error) };
    }
}
