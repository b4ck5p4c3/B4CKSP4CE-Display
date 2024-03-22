const getRandomName = () => {
    const adjectives = ["Red", "Green", "Blue", "Yellow", "Black", "White", "Orange", "Purple", "Pink", "Brown"];
    const nouns = ["Apple", "Banana", "Carrot", "Dog", "Elephant", "Fox", "Giraffe", "Horse", "Iguana", "Jellyfish"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
}

export default getRandomName;