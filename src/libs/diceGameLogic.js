/* Possible Dices */
const AVAILABLE_DICES = [
    {
        text: '9',
        value: 1,
    },
    {
        text: '10',
        value: 2,
    },
    {
        text: 'J',
        value: 3,
    },
    {
        text: 'Q',
        value: 4,
    },
    {
        text: 'K',
        value: 5,
    },
    {
        text: 'A',
        value: 6,
    },
];

/* Possible Results */
const RESULTS = {
    FiveOfAKind: {
        points: 50,
        message: 'Five of a kind',
        masterVictory: true,
    },
    FourOfAKind: {
        points: 30,
        message: 'Four of a kind',
    },
    FullHouse: {
        points: 25,
        message: 'Full house',
    },
    Straight: {
        points: 20,
        message: 'Straight',
    },
    ThreeOfAKind: {
        points: 15,
        message: 'Three of a kind',
    },
    TwoPairs: {
        points: 10,
        message: 'Two pairs',
    },
    OnePair: {
        points: 5,
        message: 'One pair',
    },
    HighCard: {
        points: 1,
        message: 'High card',
    }
};

/* Returns an object with diceList and info of player hand  */
export function getPlayer() {
    const diceList = [];
    [...Array(5)].forEach((item, i) => {
        const randomIndex = Math.floor(Math.random() * AVAILABLE_DICES.length);
        diceList.push(AVAILABLE_DICES[randomIndex]);
    });

    return {
        dices: diceList,
        info: getDiceInfo(diceList),
    };
}

/* Count the number of repetitions for the informed dice */
function countRepetitions(diceList, diceToCheck) {
    return diceList.filter(dice => dice.text === diceToCheck.text).length;
}

/* Return a list with all repeated dices */
function getRepeatedDices(diceList) {
    const repeatedDices = [];

    diceList.forEach(dice => {
        const numberOfOccurrencies = diceList.filter(item => item.text === dice.text).length;
        if (numberOfOccurrencies > 1 && !repeatedDices.some(item => item.text === dice.text)) {
            repeatedDices.push(dice);
        }
    });

    return repeatedDices;
}

/* Returns an object with the necessary info for the dice list (points and message) */
function getDiceInfo(diceList) {

    const repeated = getRepeatedDices(diceList);
    let result = {};

    if (repeated.length === 1) {
        const repetitionsCount = countRepetitions(diceList, repeated[0]);

        switch (repetitionsCount) {
            case 2:
                result = RESULTS.OnePair;
                break;
            case 3:
                result = RESULTS.ThreeOfAKind;
                break;
            case 4:
                result = RESULTS.FourOfAKind;
                break;
            case 5:
                result = RESULTS.FiveOfAKind;
                break;
            default:
                break;
        }
    } else if (repeated.length === 2) {
        const repetitionsCountOne = countRepetitions(diceList, repeated[0]);
        const repetitionsCountTwo = countRepetitions(diceList, repeated[1]);

        if (repetitionsCountOne === 2 && repetitionsCountTwo === 2) {
            result = RESULTS.TwoPairs;
        } else if ((repetitionsCountOne === 2 && repetitionsCountTwo === 3) || (repetitionsCountOne === 3 && repetitionsCountTwo === 2)) {
            result = RESULTS.FullHouse;
        }
    } else {
        diceList.sort((a, b) => a.value - b.value);
        const firstDiceValue = diceList[0].value;
        let isStraight = true;

        if (firstDiceValue === 9 || firstDiceValue === 10) {
            let previousDice = null;

            diceList.forEach(dice => {
                if (previousDice === null) {
                    previousDice = dice;
                } else if (previousDice.value + 1 === dice.value + 1) {
                    previousDice = dice;
                } else {
                    isStraight = false;
                }
            });
        } else {
            isStraight = false;
        }

        result = isStraight ? RESULTS.Straight : RESULTS.HighCard;

    }

    return result;
}
