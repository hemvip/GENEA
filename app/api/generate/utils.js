export function shuffleArray(array) {
  // Create a copy of the array to avoid mutating the original array
  let shuffledArray = array.slice()

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements i and j
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }

  return shuffledArray
}
