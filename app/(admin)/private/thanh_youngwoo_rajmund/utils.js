function calculateCombinations(n, k) {
  // Helper function to calculate factorial
  function factorial(num) {
    if (num === 0 || num === 1) return 1
    return num * factorial(num - 1)
  }

  // Calculate the combination
  return Math.round(factorial(n) / (factorial(k) * factorial(n - k)))
}
