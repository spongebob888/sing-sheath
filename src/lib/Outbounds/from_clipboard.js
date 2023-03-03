import { readText } from '@tauri-apps/api/clipboard';

export async function readOutboundFromClipboard(){
    let outboundJson = null;
    await readText()
    .then((text) =>{
        if (text == ""){

        }
        else {
            try {
                outboundJson = JSON.parse(text)
            }
            catch (ex){
                console.log(ex)
                let textTrim = trimComma(text);
                try {
                    outboundJson = JSON.parse(textTrim);
                }
                catch (ex){
                    try
                    {
                        outboundJson = JSON.parse(`[${textTrim}]`);
                    }
                    catch (ex) {
                        alert("Invalid Outbound Json");
                    }
                }
            }
        }
    })
    .catch(() =>{
        alert("Empty Clipboard");
    }
    );
    return JSON.stringify(outboundJson);
}

function trimComma(text){
    let textTrim = text.trim();
    let textLen = textTrim.length;
    if(textLen == 0)
    {
        return "";
    }
    else if (textTrim[textLen -1]==',')
    {
        return textTrim.slice(0,textLen-1);
    }
}