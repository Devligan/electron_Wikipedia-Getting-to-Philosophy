//Used ChatGPT
let pastPaths = []
function speedRunFromGivenPage(){
    const startPage = document.getElementById('startPage').value.trim();
    startSpeedrun(startPage, false);
    document.getElementById('startPage').value = '';
}
async function speedRunFromRandom() {
    const response = await fetch('https://en.wikipedia.org/wiki/Special:Random');
    const url = response.url;
    const val = url.split('/').pop();
    const startPage = val.replace(/_/g, ' ');
    startSpeedrun(val, false);
}
async function speedRunFromRandom25() {
    let ind = 0;
    let len = 0
    let paths = []
    let val = "";
    for(let i = 0; i < 25; i++) {
        document.getElementById('output').innerHTML = `<p>Running speedrun ${i + 1} of 25...</p>` + document.getElementById('output').innerHTML + '<p> </p>';
        do{
            let response = await fetch('https://en.wikipedia.org/wiki/Special:Random');
            let url = response.url;
            val = url.split('/').pop();
        }while(pastPaths.includes(val))
        paths.push(await startSpeedrun(val, true));
        val = val.replace(/_/g, ' ');
        pastPaths.push(val);
        if(paths[paths.length - 1].length > len){
            len = paths[i].length;
            ind = i;
        }
    }
    console.log(pastPaths);
    document.getElementById('output').innerHTML = `<p>Reached Philosophy from "${paths[ind][0]}" with a length of "${paths[ind].length - 1}"!</p><p>Path: ${paths[ind].join(' ➡️ ')}</p>` + document.getElementById('output').innerHTML + '<p> </p>';
}
async function startSpeedrun(startPage, is25) {
    try{
        if (startPage === '') {
            alert('Please enter a valid Wikipedia page title.');
            return;
        }

        let path = [];
        let currentPage = startPage.replace(/_/g, ' ');;
        startPage = startPage.replace(/_/g, ' ');
        while (currentPage.toLowerCase() !== 'philosophy') {
            if (path.includes(currentPage)) {
                if(!is25){
                    document.getElementById('output').innerHTML = `<p>Error: Loop detected. Unable to reach Philosophy from ` + startPage +'</p>' + document.getElementById('output').innerHTML + '<p> </p>';
                }
                return [startPage];
            }
            path.push(currentPage); // Push the unmodified title to path
            const nextPage = await getNextPage(currentPage);
            if (!nextPage) {
                if(!is25){
                    document.getElementById('output').innerHTML = `<p>Error: No valid links found on "${currentPage}". Unable to reach Philosophy from ` + startPage +'</p>' + document.getElementById('output').innerHTML + '<p> </p>';
                }
                return [startPage];
            }
            currentPage = nextPage;
        }
        path.push("Philosophy");
        if(!is25){
            document.getElementById('output').innerHTML = `<p>Reached Philosophy from "${startPage}" with a length of "${path.length - 1}"!</p><p>Path: ${path.join(' ➡️ ')}</p>` + document.getElementById('output').innerHTML + '<p> </p>';
        }
        return path;
    } catch (err){
        if(!is25){
            document.getElementById('output').innerHTML = `<p>Error: HTML server error. Unable to reach Philosophy from ` + startPage +'</p>' + document.getElementById('output').innerHTML + '<p> </p>';
        }
        return [startPage];
    }
}

async function getNextPage(page) {
    const response = await fetch(`https://en.wikipedia.org/wiki/${encodeURIComponent(page)}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs = doc.querySelectorAll('.mw-parser-output > p');
    for (let i = 0; i < paragraphs.length; i++) {
        const links = paragraphs[i].querySelectorAll('a:not(.external)');
        for (let j = 0; j < links.length; j++) {
            const link = links[j];
            const title = link.getAttribute('title');
            // Check if the link is not within parentheses or italicized
            if (title && !title.includes(':') && !isWithinParentheses(link) && !isItalicized(link)) {
                return title;
            }
        }
    }
    return null;
}

function isWithinParentheses(link) {
    let currentElement = link.previousSibling;
    while (currentElement) {
        if (currentElement.nodeType === Node.TEXT_NODE) {
            const text = currentElement.nodeValue;
            if (text.includes('(') && !text.includes(')')) {
                return true;
            } else if (text.includes(')')) {
                return false;
            }
        }
        currentElement = currentElement.previousSibling;
    }
    return false;
}

function isItalicized(element) {
    let currentElement = element.parentElement;
    while (currentElement) {
        if (currentElement.tagName === 'i' || currentElement.tagName === 'em') {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}
