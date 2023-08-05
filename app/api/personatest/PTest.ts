// Define the Personality Test class
export class PersonalityTest {
    private personalityTraits: { [trait: string]: number } = {};
    private mentalHealthDimensions: { [dimension: string]: number } = {};
  
    // Define the personality trait questions
    private personalityTraitQuestions: string[] = [
      "Sometimes rude to others.",
      "Has a forgiving nature.",
      "Considerate and kind to almost everyone.",
      "Does a thorough job.",
      "Tends to be lazy.",
      "Does things efficiently.",
      "Talkative.",
      "Outgoing and sociable.",
      "Reserved.",
      "Worries a lot.",
      "Gets nervously easily.",
      "Relaxed and handles stress well.",
      "Worries a lot.",
      "Gets nervously easily.",
      "Relaxed and handles stress well.",
      "Original and comes up with new ideas.",
      "Values artistic and aesthetic experiences.",
      "Has an active imagination.",
    ];
  
    // Define the mental health dimension questions
    private mentalHealthDimensionQuestions: string[] = [
      "Able to concentrate on whatever you're doing.",
      "Lost much sleep over worry.",
      "Felt that you were playing a useful part in things.",
      "Felt capable of making decisions about things.",
      "Felt constantly under strain.",
      "Felt you couldn't overcome your difficulties.",
      "Able to enjoy your normal day-to-day activities.",
      "Able to face up to problems.",
      "Feeling unhappy or depressed.",
      "Losing confidence in yourself.",
      "Thinking of yourself as a worthless person.",
      "Feeling reasonably happy, all things considered.",
    ];
  
    // Method to display the personality trait questions and gather answers
    public gatherPersonalityTraitAnswers() {
      console.log("Please rate the following statements on a scale from 1 to 7:");
      for (let i = 0; i < this.personalityTraitQuestions.length; i++) {
        const question = this.personalityTraitQuestions[i];
        const rating = this.askForRating(question);
        this.personalityTraits[`Trait ${i + 1}`] = rating;
      }
    }
  
    // Method to display the mental health dimension questions and gather answers
    public gatherMentalHealthDimensionAnswers() {
      console.log("Please rate the following statements on a scale from 1 to 7:");
      for (let i = 0; i < this.mentalHealthDimensionQuestions.length; i++) {
        const question = this.mentalHealthDimensionQuestions[i];
        const rating = this.askForRating(question);
        this.mentalHealthDimensions[`Dimension ${i + 1}`] = rating;
      }
    }
  
    // Method to ask the user for rating and return the answer
    public askForRating(question: string): number {
        // You can implement a more sophisticated way of getting user input in a web context,
        // such as using modals, forms, or chat bubbles.
        const userInput = prompt(`${question} (Enter a rating from 1 to 7):`);
        return Number(userInput);
      }
  
    // Method to calculate the total scores for personality traits and mental health dimensions
    public calculateScores(): [number, number] {
      const personalityTraitScore = Object.values(this.personalityTraits).reduce((acc, val) => acc + val, 0);
      const mentalHealthDimensionScore = Object.values(this.mentalHealthDimensions).reduce((acc, val) => acc + val, 0);
      return [personalityTraitScore, mentalHealthDimensionScore];
    }
  
    // Method to interpret the scores and provide feedback to the user
    public interpretScores(personalityTraitScore: number, mentalHealthDimensionScore: number) {
      // You can implement your own interpretation logic based on the research paper's findings
      // For simplicity, we'll just print the scores here.
      console.log("Personality Trait Score:", personalityTraitScore);
      console.log("Mental Health Dimension Score:", mentalHealthDimensionScore);
    }
  
    // Method to run the personality test
    public runTest() {
      console.log("Welcome to the Personality Test!");
      this.gatherPersonalityTraitAnswers();
      this.gatherMentalHealthDimensionAnswers();
      const [personalityTraitScore, mentalHealthDimensionScore] = this.calculateScores();
      this.interpretScores(personalityTraitScore, mentalHealthDimensionScore);
      console.log("Thank you for taking the test!");
    }
  }
  
  export default PersonalityTest;