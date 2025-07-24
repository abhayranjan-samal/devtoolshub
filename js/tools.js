// Tools Page Functionality
class ToolsManager {
    constructor() {
        this.initTabs();
        this.initConverter();
        this.initValidators();
    }

    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const toolContents = document.querySelectorAll('.tool-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active content
                toolContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    initConverter() {
        const convertBtn = document.getElementById('convert-btn');
        const inputText = document.getElementById('input-text');
        const outputText = document.getElementById('output-text');
        const inputFormat = document.getElementById('input-format');
        const copyBtn = document.getElementById('copy-btn');

        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                this.convertData();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyToClipboard();
            });
        }

        // Auto-detect input format
        if (inputText) {
            inputText.addEventListener('input', () => {
                this.autoDetectFormat();
            });
        }
    }

    convertData() {
        const inputText = document.getElementById('input-text');
        const outputText = document.getElementById('output-text');
        const inputFormat = document.getElementById('input-format');

        if (!inputText.value.trim()) {
            NotificationManager.show('Please enter some data to convert', 'error');
            return;
        }

        try {
            let result;
            if (inputFormat.value === 'json') {
                // JSON to YAML
                const jsonData = JSON.parse(inputText.value);
                result = jsyaml.dump(jsonData, { indent: 2 });
            } else {
                // YAML to JSON
                const yamlData = jsyaml.load(inputText.value);
                result = JSON.stringify(yamlData, null, 2);
            }
            
            outputText.value = result;
            NotificationManager.show('Conversion successful!');
        } catch (error) {
            outputText.value = `Error: ${error.message}`;
            NotificationManager.show('Conversion failed. Please check your input format.', 'error');
        }
    }

    autoDetectFormat() {
        const inputText = document.getElementById('input-text');
        const inputFormat = document.getElementById('input-format');
        const text = inputText.value.trim();

        if (text) {
            try {
                JSON.parse(text);
                inputFormat.value = 'json';
            } catch {
                try {
                    jsyaml.load(text);
                    inputFormat.value = 'yaml';
                } catch {
                    // Keep current selection if can't detect
                }
            }
        }
    }

    copyToClipboard() {
        const outputText = document.getElementById('output-text');
        
        if (!outputText.value.trim()) {
            NotificationManager.show('Nothing to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(outputText.value).then(() => {
            NotificationManager.show('Copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            NotificationManager.show('Copied to clipboard!');
        });
    }

    initValidators() {
        // JSON Validator
        const validateJsonBtn = document.getElementById('validate-json-btn');
        if (validateJsonBtn) {
            validateJsonBtn.addEventListener('click', () => {
                this.validateJSON();
            });
        }

        // YAML Validator
        const validateYamlBtn = document.getElementById('validate-yaml-btn');
        if (validateYamlBtn) {
            validateYamlBtn.addEventListener('click', () => {
                this.validateYAML();
            });
        }
    }

    validateJSON() {
        const jsonInput = document.getElementById('json-input');
        const jsonResult = document.getElementById('json-result');
        
        if (!jsonInput.value.trim()) {
            jsonResult.innerHTML = '<p>Please enter JSON data to validate</p>';
            jsonResult.className = 'result-box';
            return;
        }

        try {
            const parsed = JSON.parse(jsonInput.value);
            jsonResult.innerHTML = `
                <div class="result-success">
                    <h4><i class="fas fa-check-circle"></i> Valid JSON</h4>
                    <p>Your JSON is syntactically correct!</p>
                    <div class="json-info">
                        <p><strong>Type:</strong> ${Array.isArray(parsed) ? 'Array' : typeof parsed}</p>
                        ${Array.isArray(parsed) ? `<p><strong>Length:</strong> ${parsed.length}</p>` : ''}
                        ${typeof parsed === 'object' && parsed !== null ? 
                            `<p><strong>Keys:</strong> ${Object.keys(parsed).length}</p>` : ''}
                    </div>
                </div>
            `;
            jsonResult.className = 'result-box result-success';
            NotificationManager.show('JSON is valid!');
        } catch (error) {
            jsonResult.innerHTML = `
                <div class="result-error">
                    <h4><i class="fas fa-exclamation-circle"></i> Invalid JSON</h4>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <div class="error-details">
                        <p>Please check your JSON syntax and try again.</p>
                    </div>
                </div>
            `;
            jsonResult.className = 'result-box result-error';
            NotificationManager.show('JSON validation failed', 'error');
        }
    }

    validateYAML() {
        const yamlInput = document.getElementById('yaml-input');
        const yamlResult = document.getElementById('yaml-result');
        
        if (!yamlInput.value.trim()) {
            yamlResult.innerHTML = '<p>Please enter YAML data to validate</p>';
            yamlResult.className = 'result-box';
            return;
        }

        try {
            const parsed = jsyaml.load(yamlInput.value);
            yamlResult.innerHTML = `
                <div class="result-success">
                    <h4><i class="fas fa-check-circle"></i> Valid YAML</h4>
                    <p>Your YAML is syntactically correct!</p>
                    <div class="yaml-info">
                        <p><strong>Type:</strong> ${Array.isArray(parsed) ? 'Array' : typeof parsed}</p>
                        ${Array.isArray(parsed) ? `<p><strong>Length:</strong> ${parsed.length}</p>` : ''}
                        ${typeof parsed === 'object' && parsed !== null ? 
                            `<p><strong>Keys:</strong> ${Object.keys(parsed).length}</p>` : ''}
                    </div>
                </div>
            `;
            yamlResult.className = 'result-box result-success';
            NotificationManager.show('YAML is valid!');
        } catch (error) {
            yamlResult.innerHTML = `
                <div class="result-error">
                    <h4><i class="fas fa-exclamation-circle"></i> Invalid YAML</h4>
                    <p><strong>Error:</strong> ${error.message}</p>
                    <div class="error-details">
                        <p>Please check your YAML syntax and try again.</p>
                    </div>
                </div>
            `;
            yamlResult.className = 'result-box result-error';
            NotificationManager.show('YAML validation failed', 'error');
        }
    }
}

// Initialize tools when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ToolsManager();
});
