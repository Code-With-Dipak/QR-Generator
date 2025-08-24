// DOM Elements
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCodeContainer = document.getElementById('qrCode');

// Initialize variables
let currentQRCode = null;

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);
downloadBtn.addEventListener('click', downloadQRCode);
urlInput.addEventListener('input', validateInput);
urlInput.addEventListener('keypress', handleKeyPress);

// Validate URL input
function validateInput() {
    const url = urlInput.value.trim();
    const isValid = isValidUrl(url);
    
    generateBtn.disabled = !isValid;
    
    if (url === '') {
        resetQRCode();
    }
}

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter' && !generateBtn.disabled) {
        generateQRCode();
    }
}

// Check if URL is valid
function isValidUrl(string) {
    if (!string) return false;
    
    try {
        // Try to create a URL object
        new URL(string);
        return true;
    } catch (_) {
        // If it fails, try adding https:// prefix
        try {
            new URL('https://' + string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Generate QR Code
function generateQRCode() {
    let url = urlInput.value.trim();
    
    // Add https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // Show loading state
    showLoading();
    
    // Clear previous QR code
    if (currentQRCode) {
        qrCodeContainer.innerHTML = '';
    }
    
    // Generate QR code with a small delay for better UX
    setTimeout(() => {
        try {
            // Create QR code
            QRCode.toCanvas(url, {
                width: 256,
                height: 256,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function (error, canvas) {
                if (error) {
                    showError('Failed to generate QR code. Please try again.');
                    return;
                }
                
                // Add success class for animation
                canvas.classList.add('success');
                
                // Append canvas to container
                qrCodeContainer.innerHTML = '';
                qrCodeContainer.appendChild(canvas);
                
                // Store current QR code
                currentQRCode = canvas;
                
                // Enable download button
                downloadBtn.disabled = false;
                
                // Add click event to QR code for scanning
                canvas.addEventListener('click', () => {
                    alert('QR Code contains: ' + url);
                });
                
                // Add hover effect
                canvas.style.cursor = 'pointer';
                canvas.title = 'Click to view URL';
            });
        } catch (error) {
            showError('Error generating QR code: ' + error.message);
        }
    }, 500);
}

// Show loading state
function showLoading() {
    qrCodeContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-spinner loading"></i>
            <p>Generating QR code...</p>
        </div>
    `;
    downloadBtn.disabled = true;
}

// Show error message
function showError(message) {
    qrCodeContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i>
            <p>${message}</p>
        </div>
    `;
    downloadBtn.disabled = true;
}

// Reset QR code display
function resetQRCode() {
    qrCodeContainer.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-qrcode"></i>
            <p>Your QR code will appear here</p>
        </div>
    `;
    downloadBtn.disabled = true;
    currentQRCode = null;
}

// Download QR Code
function downloadQRCode() {
    if (!currentQRCode) return;
    
    try {
        // Create download link
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = currentQRCode.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showToast('QR code downloaded successfully!');
    } catch (error) {
        showToast('Error downloading QR code: ' + error.message, 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#ff6b6b'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe team members for animation
document.querySelectorAll('.team-member').forEach(member => {
    member.style.opacity = '0';
    member.style.transform = 'translateY(20px)';
    member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(member);
});

// Initialize
validateInput();

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed: ', err));
    });
}
