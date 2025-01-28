// ========== CẤU HÌNH ==========
const SLIDE_DURATION = 5000;
const IMAGE_JSON = "data/images.json";
const MESSAGE_JSON = "data/message.json";

// ========== XỬ LÝ ẢNH NỀN ==========
let currentImageIndex = 0;
let imageElements = [];

function loadImages() {
    fetch(IMAGE_JSON)
        .then(response => response.json())
        .then(imageLinks => {
            imageElements = imageLinks;
            const leftBg = document.getElementById("background-left");
            const rightBg = document.getElementById("background-right");
            
            leftBg.style.backgroundImage = `url('${imageElements[0]}')`;
            rightBg.style.backgroundImage = `url('${imageElements[1]}')`;
            
            leftBg.classList.add("active");
            rightBg.classList.add("active");

            setInterval(changeBackground, SLIDE_DURATION);
        })
        .catch(error => console.error("Lỗi tải ảnh:", error));
}

function changeBackground() {
    if (imageElements.length < 2) return;

    const leftElement = document.getElementById("background-left");
    const rightElement = document.getElementById("background-right");

    const nextLeftIndex = (currentImageIndex + 2) % imageElements.length;
    const nextRightIndex = (currentImageIndex + 3) % imageElements.length;

    leftElement.classList.remove("active");
    rightElement.classList.remove("active");

    setTimeout(() => {
        leftElement.style.backgroundImage = `url('${imageElements[nextLeftIndex]}')`;
        rightElement.style.backgroundImage = `url('${imageElements[nextRightIndex]}')`;

        leftElement.classList.add("active");
        rightElement.classList.add("active");
    }, 500);

    currentImageIndex = nextLeftIndex;
}

// ========== HIỂN THỊ TIN NHẮN ==========
function createMessage() {
    fetch(MESSAGE_JSON)
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.getElementById("message");
            messageContainer.innerHTML = `<h2 class="recipient">💌 Gửi: ${data.recipient || "Người Đặc Biệt"}</h2>`;
            
            let animationDelay = 0; // Thời gian delay tổng
            const lineDelay = 0.5;  // Delay giữa các dòng (giây)

            // Lặp qua từng dòng tin nhắn
            data.message.forEach((textLine) => {
                const p = document.createElement("p");
                p.className = "typing-effect";
                p.textContent = textLine; // Nội dung dòng text

                // Tính thời gian animation typing cho từng dòng
                const charCount = textLine.length;
                const duration = charCount * 0.12; // Mỗi ký tự 0.12s

                // Gắn CSS animation
                p.style.animation = `
                    typing ${duration}s steps(${charCount}, end) ${animationDelay}s forwards,
                    blink-caret 0.75s step-end infinite ${animationDelay}s
                `;

                // Thêm dòng text vào container
                messageContainer.appendChild(p);

                // Xóa con trỏ nhấp nháy sau khi animation hoàn tất
                p.addEventListener("animationend", () => {
                    p.style.borderRight = "none"; // Tắt con trỏ
                });

                // Cập nhật thời gian delay cho dòng tiếp theo
                animationDelay += duration + lineDelay;
            });
        })
        .catch((error) => {
            console.error("Lỗi tải tin nhắn:", error);

            // Hiển thị fallback khi lỗi tải JSON
            const fallbackMessage = `
                <p>Xin lỗi, không thể tải tin nhắn. Hãy thử lại sau!</p>
            `;
            document.getElementById("message").innerHTML = fallbackMessage;
        });
}

// ========== KHỞI CHẠY ==========
window.addEventListener("DOMContentLoaded", () => {
    loadImages();
    setTimeout(createMessage, 1500); // Delay để load ảnh nền trước
});
    