document.addEventListener("DOMContentLoaded", function() {
    // 1. Copy Code Buttons
    const codeBlocks = document.querySelectorAll("pre");
    
    codeBlocks.forEach(function(block) {
        // Ensure relative positioning on the pre for absolute button
        block.style.position = "relative";
        
        const button = document.createElement("button");
        button.className = "copy-btn";
        button.innerText = "Copy";
        
        button.addEventListener("click", function() {
            const code = block.querySelector("code");
            const text = code ? code.innerText : block.innerText;
            
            navigator.clipboard.writeText(text).then(function() {
                button.innerText = "Copied!";
                button.classList.add("copied");
                setTimeout(function() {
                    button.innerText = "Copy";
                    button.classList.remove("copied");
                }, 2000);
            });
        });
        
        block.appendChild(button);
    });

    // 2. Dynamic Table of Contents
    const content = document.getElementById("post-content");
    const tocList = document.getElementById("toc-list");
    const tocSidebar = document.getElementById("toc-sidebar");

    if (content && tocList) {
        const headers = content.querySelectorAll("h2, h3");
        
        if (headers.length === 0) {
            if(tocSidebar) tocSidebar.style.display = 'none';
        } else {
            headers.forEach(function(header, index) {
                // Ensure header has an ID
                if (!header.id) {
                    header.id = "header-" + index;
                }
                
                const li = document.createElement("li");
                li.className = "toc-item toc-" + header.tagName.toLowerCase();
                
                const a = document.createElement("a");
                a.href = "#" + header.id;
                a.innerText = header.innerText;
                
                li.appendChild(a);
                tocList.appendChild(li);
            });
        }
    }

    // 3. Dynamic Medium RSS Feed
    const mediumContainer = document.getElementById("medium-feed");
    if (mediumContainer) {
        fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40HimanshuP601")
            .then(res => res.json())
            .then(data => {
                if (data.status === "ok" && data.items.length > 0) {
                    mediumContainer.innerHTML = "";
                    data.items.slice(0, 4).forEach(item => {
                        const date = new Date(item.pubDate).toLocaleDateString();
                        const postHtml = `
                            <div class="terminal-post">
                                <div class="pub-date">[PUBLIC_RELEASE: ${date}]</div>
                                <a href="${item.link}" target="_blank">${item.title}</a>
                            </div>
                        `;
                        mediumContainer.innerHTML += postHtml;
                    });
                } else {
                    mediumContainer.innerHTML = "<p style='color: red;'>[!] connection_refused: no posts found</p>";
                }
            })
            .catch(err => {
                mediumContainer.innerHTML = "<p style='color: red;'>[!] err_timeout: unable to resolve feed</p>";
            });
    }
});
