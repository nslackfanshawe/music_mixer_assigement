console.log("JavaScript File is linked");

const dragboxes = document.querySelectorAll(".dragbox");
const targetSlots = document.querySelectorAll(".target-slot");
const resetButton = document.querySelector("#reset-btn");

let currentDraggedElement = null;
let droppedSuccessfully = false;

function dragStart() {
    currentDraggedElement = this;
    droppedSuccessfully = false;
    this.classList.add("dragging");
}

function dragEnd() {
    this.classList.remove("dragging");

    if (!droppedSuccessfully) {
        moveToHome(this);
    }

    currentDraggedElement = null;
    clearHighlights();
}

function dragOver(event) {
    event.preventDefault();
}

function dropped(event) {
    event.preventDefault();

    if (!currentDraggedElement) {
        return;
    }

    const boxAlreadyPlaced = this.querySelector(".dragbox");

    if (boxAlreadyPlaced) {
        moveToHome(currentDraggedElement);
        droppedSuccessfully = true;
        this.classList.remove("drag-over");
        return;
    }

    const previousParent = currentDraggedElement.parentElement;

    if (previousParent && previousParent.classList.contains("target-slot")) {
        stopOrganSound(currentDraggedElement.dataset.sound);
    }

    this.appendChild(currentDraggedElement);
    droppedSuccessfully = true;
    this.classList.remove("drag-over");
    playOrganSound(currentDraggedElement.dataset.sound);
}

function handleDragEnter(event) {
    event.preventDefault();
    this.classList.add("drag-over");
}

function handleDragLeave() {
    this.classList.remove("drag-over");
}

function clearHighlights() {
    targetSlots.forEach(removeHighlightClass);
}

function removeHighlightClass(slot) {
    slot.classList.remove("drag-over");
}

function moveToHome(dragbox) {
    const homeId = dragbox.dataset.home;
    const homeSlot = document.querySelector(`#${homeId}`);

    stopOrganSound(dragbox.dataset.sound);
    homeSlot.appendChild(dragbox);
}

function playOrganSound(soundNumber) {
    const audio = document.querySelector(`#audio-${soundNumber}`);

    if (!audio) {
        return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.loop = true;
    audio.play();
}

function stopOrganSound(soundNumber) {
    const audio = document.querySelector(`#audio-${soundNumber}`);

    if (!audio) {
        return;
    }

    audio.pause();
    audio.currentTime = 0;
}

function resetMixer() {
    dragboxes.forEach(moveBoxToStart);
    clearHighlights();
}

function moveBoxToStart(dragbox, index) {
    const homeSlot = document.querySelector(`#home-${index + 1}`);

    stopOrganSound(dragbox.dataset.sound);
    homeSlot.appendChild(dragbox);
}

function setStartingPositions(dragbox, index) {
    const homeSlot = document.querySelector(`#home-${index + 1}`);

    dragbox.dataset.home = `home-${index + 1}`;
    homeSlot.appendChild(dragbox);
}

function addDragboxEvents(dragbox) {
    dragbox.addEventListener("dragstart", dragStart);
    dragbox.addEventListener("dragend", dragEnd);
}

function addTargetSlotEvents(slot) {
    slot.addEventListener("dragover", dragOver);
    slot.addEventListener("drop", dropped);
    slot.addEventListener("dragenter", handleDragEnter);
    slot.addEventListener("dragleave", handleDragLeave);
}

dragboxes.forEach(setStartingPositions);
dragboxes.forEach(addDragboxEvents);
targetSlots.forEach(addTargetSlotEvents);
resetButton.addEventListener("click", resetMixer);