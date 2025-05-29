function createImageBurst(x, y, imageSrc) {
    const fragmentCount = 50; // Number of pieces
    const radius = 400; // Spread radius

    for (let i = 0; i < fragmentCount; i++) {
        const angle = (2 * Math.PI * i) / fragmentCount;
        const xDirection = Math.cos(angle) * radius;
        const yDirection = Math.sin(angle) * radius;

        const fragment = document.createElement("img");
        fragment.src = imageSrc;
        fragment.classList.add("image-fragment");

        fragment.style.width = `${Math.random() * 200 + 10}px`;
        fragment.style.height = fragment.style.width;
        fragment.style.top = `${y}px`;
        fragment.style.left = `${x}px`;

        fragment.style.setProperty("--x", `${xDirection}px`);
        fragment.style.setProperty("--y", `${yDirection}px`);

        fragment.style.animation = `burst ${Math.random() * 1.5 + 0.3}s ease-out forwards`;

        document.body.appendChild(fragment);
        setTimeout(() => fragment.remove(), 2000);
    }
}

document.body.addEventListener("click", (e) => {
    createImageBurst(e.pageX, e.pageY, "d.png"); // Replace with your image URL
});
