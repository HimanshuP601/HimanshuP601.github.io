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
});
