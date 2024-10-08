let reader;

const triggerSearch = () => {
    let query = document.getElementById("question").value;

    if (query == undefined || query.length == 0) {
        alert("please enter a query/prompt");
        resetLoader();
        return false;
    }

    setTimeout(function () {
        doSearch().then(() => {
            doSearchChatJsonDebounced();
        });
    }, 500);
}

const threshold = 0.25;
const searchLimit = 20;
const indexName = "documentation";

const buildSearchPrompt = () => {
    let formData = {}
    formData.prompt = document.getElementById("question").value;
    formData.threshold = threshold;
    formData.searchLimit = searchLimit;
    formData.stream = true;
    formData.model = "gpt-4o"
    formData.responseLengthTokens = 512;
    formData.indexName = "default";
    return formData;
}

/**
 * Gets the API Key once and caches it
 **/
const apiKey = {};
const getApiKey = (e) => {

    if (apiKey.hasOwnProperty("key")) {
        return apiKey;
    }
    return fetch("/api/vtl/ai", {
        method: "GET", headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            apiKey.key = data.key;
            return apiKey;
        });
}

const onBtnClick = () => {
    let query = document.getElementById("question").value;

    if (query == undefined || query.length == 0) {
        alert("please enter a query/prompt");
        resetLoader();
        return false;
    }

    document.getElementById("loader").style.display = "block";

    triggerSearch();
}

const doSearchChatJsonDebounced = async () => {
    const formData = buildSearchPrompt()

    if (formData.prompt == undefined || formData.prompt.trim().length == 0) {
        alert("please enter a query/prompt");
        resetLoader();
        return false;
    }

    let line = "";
    let lines = [];
    try {
        const response = await fetch('/api/v1/ai/completions', {
            method: "POST", body: JSON.stringify(formData), headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getApiKey().key
            }
        });

        // Read the response as a stream of data
        reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
        if (!reader) return false;

        document.getElementById("answer").innerHTML = "";
        document.getElementById("answer").innerHTML += "<strong>Summary:</strong>\n\n";
        document.getElementById("answer").style.display = "block";
        let reset = true;

        while (true) {
            const { value, done } = await reader.read();

            if (done) {
                break;
            }
            lines = (line + value).split('\ndata: ');

            for (line of lines) {
                console.log('i see a line', line)
                line = line.replace(/^data: /, '').trim();
                if (line.length === 0) continue; // ignore empty message
                if (line.startsWith(':')) continue; // ignore sse comment message

                if (line === '[DONE]') {
                    break;
                }
                try {
                    const json = JSON.parse(line);
                    line = "";
                    const value = json.choices[0].delta.content;
                    if (value === undefined) {
                        continue;
                    }
                    document.getElementById("answer").innerHTML += value;
                    if (reset) {
                        resetLoader();
                        reset = false;
                    }
                } catch (e) {
                    // line is half sent, will append to the next value
                    console.log("line:" + line);
                }
            }
        }
    } catch (e) {
        console.log("got an error:", e);
        console.log("line:" + line);
        console.log("lines:" + lines);
    } finally {
        resetLoader();
    }

    return true;
};

const resetLoader = () => {
    document.getElementById("loader").style.display = "none";
}

const doSearch = async () => {
    const formData = buildSearchPrompt();

    const semanticSearchResults = document.getElementById("semanticSearchResults");
    semanticSearchResults.style.display = "block";

    const truncateString = (str, num) => {
        if (!str) return;

        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...'
    }

    fetch("/api/v1/ai/search", {
        method: "POST", body: JSON.stringify(formData), headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getApiKey().key
        }
    }).then(response => response.json()).then(data => {
        semanticSearchResults.innerHTML = "<p><strong>References</strong></p>";
        data.dotCMSResults.map(row => {
            if (!row.URL_MAP_FOR_CONTENT) return null;
            let referenceDiv = document.createElement("div");
            let titleDiv = document.createElement("div");
            let refTitle = document.createElement("a");
            refTitle.innerHTML = row.title;
            refTitle.href = row.URL_MAP_FOR_CONTENT;
            refTitle.className = "ref-title";
            referenceDiv.append(titleDiv);
            titleDiv.append(refTitle);

            let refDescription = document.createElement("div");
            refDescription.innerHTML = truncateString(row.matches[0].extractedText, 200);
            refDescription.className = "ref-description";

            referenceDiv.append(refDescription);

            let chipsDiv = document.createElement("div");
            let chip1 = document.createElement("div");
            let chip2 = document.createElement("div");
            let chip3 = document.createElement("div");

            let channel = row.contentType == 'DotcmsDocumentation' ? 'Documentation' : row.contentType;
            channel = (row.contentType == 'noShow' || row.contentType == undefined) ? 'Webpage' : channel;

            chip1.innerHTML = `<strong>${channel}<strong>`;
            chip2.innerHTML = `Score: <strong>${(1 - parseFloat(row.matches[0].distance)).toFixed(2) * 100}%</strong>`;
            chip3.innerHTML = `Matches: <strong>${row.matches.length}</strong>`;

            chipsDiv.className = "ref-chips";
            chip1.className = "ref-channel";
            chip2.className = "ref-score";
            chip3.className = "ref-match";

            chipsDiv.append(chip1);
            chipsDiv.append(chip2);
            chipsDiv.append(chip3);
            referenceDiv.append(chipsDiv);

            semanticSearchResults.append(referenceDiv);
        })

        return true;
    })

}

document.addEventListener("DOMContentLoaded", function () {
    getApiKey();
});

