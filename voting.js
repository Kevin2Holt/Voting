const fs = require('node:fs');

function getVoter(numOptions, weights, group) { // Assumes only 1 topic
	let options = Array.from({ length: numOptions }, (_, index) => index + 1);
	let voter = Array.from({ length: numOptions }, () => 0);
	// console.log("options:", options, "weights:", weights);
	let tempWeights = [...weights];
	// console.log("tempWeights:", tempWeights);




	if (group == 1) {
		tempWeights[1] = 1;
	}
	else if (group == 2) {
		tempWeights[0] = 1;
	}
	else if (group == 3) {
		// tempWeights[0] = 1;
		// tempWeights[1] = 1;
		// tempWeights[2] = 50;
	}
	// console.log("tempWeights:", tempWeights);

	// Weighted random vote selection
	return voter.map(() => {

		let totalWeight = tempWeights.map((sum => value => sum += value)(0));
		let random = Math.floor(Math.random() * totalWeight[totalWeight.length - 1]);
		let index = totalWeight.findIndex(el => random < el); // Find the index of the first element greater than the random number
		// console.log("options:", options, "tempWeights:", tempWeights, "totalWeight:", totalWeight, "random:", random, "index:", index);
		let choice = options[index];
		options.splice(index, 1);
		tempWeights.splice(index, 1);
		return choice;
	});
}

function countVotes(votes, numOptions, log = false, layer = -1) {
	let voteCounts = Array.from({ length: numOptions }, () => 0);
	// console.log("numVoters:", votes.length, "votes:", votes);

	votes.forEach(voter => {
		voter.forEach((choice, index) => {
			// console.log("choice:", choice, "\tindex:", index);
			voteCounts[choice - 1] += (numOptions - index) + 1;
		});
	});

	let sortedVotes = voteCounts.toSorted();
	if (log) console.log("sortedVotes:", sortedVotes);
	if (sortedVotes[0] < sortedVotes[sortedVotes.length - 1]) {
		// console.log("Reversing sortedVotes");
		sortedVotes = sortedVotes.toReversed();
	}

	let output = Array.from({ length: numOptions }, () => 0);
	sortedVotes.forEach((count, index) => {// Loops through each vote count in order (most to least)
		for (let i = 0; i < numOptions; i++) {// Loops through the original vote counts
			if (voteCounts[i] == count) {// Checks for a match
				if (output.includes(i + 1)) {// Checks if the option has already been assigned a position
					continue;
				}

				output[index] = i + 1;
			}
		}
	});
	// console.log("output:", output);
	if (log) console.log("layer:", layer, "\tvoteCounts:", voteCounts, "\tsortedVotes:", sortedVotes, "\toutput:", output);
	return output;
}



function getVotes(numVoters, numOptions, weights, group) {
	// console.log("getVotes()");
	return Array.from({ length: numVoters }, () => getVoter(numOptions, weights, group));
}
// let [finalVotes, votes] = recursiveVote(numVoters, numGroups, weights.length, weights, numLayers, curIteration, groupBias);
function recursiveVote(numVoters, numGroups, numOptions, weights, numLayers, curIteration = 1, groupBias = [], layerGroup = {}, curSuperGroup = -1, curLayer = -1) {


	let layerVotes = [];
	let allVotes = [];

	if (curLayer <= -1) {
		curLayer = numLayers;
	}

	let curNumGroups = numGroups[numGroups.length - curLayer];
	// console.log("curNumGroups:", curNumGroups);

	// console.log("curLayer:", curLayer);

	if (curLayer <= 1) {
		for (let curGroup = 0; curGroup < curNumGroups; curGroup++) {
			// console.log("curLayer:", curLayer, "curGroup:", curGroup, "groupBias:", groupBias[curSuperGroup]);
			// Get Votes
			let newVotes = getVotes(numVoters, numOptions, weights, groupBias[curSuperGroup]);
			// console.log("newVotes:", newVotes);

			// Process Votes
			layerVotes.push(countVotes(newVotes, numOptions));
			allVotes = allVotes.concat(newVotes);
		}
	}
	else {
		for (let curGroup = 0; curGroup < curNumGroups; curGroup++) {
			if (curLayer >= numLayers) {
				// if (curLayer != numLayers) {
				// 	layerGroup[curLayer] = curGroup + 1;
				// }
				if ((curGroup + 1) % (curNumGroups / 50) == 0) {
					layerGroup[curLayer] = curGroup + 1;
					console.log(`\x1b[1mIteration: \x1b[0m\x1b[33m${curIteration}\x1b[0m\x1b[1m\tLayer ${numLayers}: \x1b[0m\x1b[33m${layerGroup[numLayers]}\x1b[0m`);
				}
			}
			// Get Votes
			if (curLayer == numLayers) {
				curSuperGroup = curGroup;
			}
			let [newVotes, oldVotes] = recursiveVote(numVoters, numGroups, numOptions, weights, numLayers, curIteration, groupBias, layerGroup, curSuperGroup, curLayer - 1);

			// Process Votes
			if (newVotes.length == 1) {
				layerVotes.push(newVotes[0]);
			}
			else {
				layerVotes.push(countVotes(newVotes, numOptions, false, curLayer));
			}
			allVotes = allVotes.concat(newVotes, oldVotes);
		}
	}


	return [layerVotes, allVotes];
}

function getPercentages(finalVotes, indVotes, spot = 1) {
	var output = [];

	// console.log("finalVotes:", finalVotes);
	// console.log("indVotes:", indVotes);

	let winVote = finalVotes[spot - 1];
	let totalCount = 0;

	for (curIndex = 0; curIndex < finalVotes.length; curIndex++) {
		let winningCount = 0;

		indVotes.forEach(voter => {
			if (voter[curIndex] == winVote) {
				winningCount++;
				totalCount++;
			}
		});

		output.push((winningCount / indVotes.length) * 100);
	}

	// console.log("Total:", indVotes.length, "\tActual:", totalCount);
	// console.log("output:", output.map((sum => value => sum += value)(0)).map(value => value.toFixed(2)));

	return output;
}

function getRandom() {
	return Math.round(Math.random());
}


const numVoters = 17128;// 17,128
const numGroups = [50, 62, 6];

const numLayers = numGroups.length;
const numIterations = 1;

const weights = [48, 46, 6];




const groupBias = []
for (let i = 0; i < 19; i++) {
	groupBias.push(1);
}
for (let i = 0; i < 24; i++) {
	groupBias.push(2);
}
for (let i = 0; i < 7; i++) {
	groupBias.push(3);
}


const allPercentages = [];
const allPercentages2 = [];
const allPercentages3 = [];
const allFinalVotes = [];

console.log("numIterations:", numIterations);


for (let curIteration = 1; curIteration <= numIterations; curIteration++) {
	let [finalVotes, votes] = recursiveVote(numVoters, numGroups, weights.length, weights, numLayers, curIteration, groupBias);
	// console.log("finalVotes:", finalVotes);
	finalVotes = countVotes(finalVotes, weights.length);

	let percentages = getPercentages(finalVotes, votes).map(value => value.toFixed(2));
	// percentages = percentages.map((sum => value => sum += value)(0)).map(value => value.toFixed(2));
	let percentages2 = getPercentages(finalVotes, votes, 2).map(value => value.toFixed(2));
	// percentages2 = percentages2.map((sum => value => sum += value)(0)).map(value => value.toFixed(2));
	let percentages3 = getPercentages(finalVotes, votes, 3).map(value => value.toFixed(2));
	// percentages3 = percentages3.map((sum => value => sum += value)(0)).map(value => value.toFixed(2));

	// console.log("votes:", votes);
	console.log(`\x1b[0m\x1b[1mIteration: \x1b[0m\x1b[33m${curIteration}\x1b[0m\x1b[1m\tfinalVotes: \x1b[0m\x1b[33m${finalVotes.join('\x1b[0m\x1b[1m, \x1b[0m\x1b[33m')}\x1b[0m\x1b[1m\tPercentages: (\x1b[0m\x1b[33m${percentages.join('%\x1b[0m\x1b[1m, \x1b[0m\x1b[33m')}%\x1b[0m\x1b[1m)\x1b[0m\x1b[1m\tPercentages 2: (\x1b[0m\x1b[33m${percentages2.join('%\x1b[0m\x1b[1m, \x1b[0m\x1b[33m')}%\x1b[0m\x1b[1m)\x1b[0m\x1b[1m\tPercentages 3: (\x1b[0m\x1b[33m${percentages3.join('%\x1b[0m\x1b[1m, \x1b[0m\x1b[33m')}%\x1b[0m\x1b[1m)\x1b[0m`);
	// console.log(`Percentages: (${percentages.join('%, ')}%)`);

	allPercentages.push(percentages);
	allPercentages2.push(percentages2);
	allPercentages3.push(percentages3);
	allFinalVotes.push(finalVotes);
}

// console.log("allPercentages:", allPercentages);

const avgPercentages = Array.from({ length: weights.length }, () => 0);
for (let top = 0; top < weights.length; top++) {
	let sum = 0;
	for (let iteration = 0; iteration < numIterations; iteration++) {
		sum += parseFloat(allPercentages[iteration][top]);
	}
	// console.log(`sum: ${sum}`);
	avgPercentages[top] = sum / numIterations;
}

const avgPercentages2 = Array.from({ length: weights.length }, () => 0);
for (let top = 0; top < weights.length; top++) {
	let sum = 0;
	for (let iteration = 0; iteration < numIterations; iteration++) {
		sum += parseFloat(allPercentages2[iteration][top]);
	}
	// console.log(`sum: ${sum}`);
	avgPercentages2[top] = sum / numIterations;
}

const avgPercentages3 = Array.from({ length: weights.length }, () => 0);
for (let top = 0; top < weights.length; top++) {
	let sum = 0;
	for (let iteration = 0; iteration < numIterations; iteration++) {
		sum += parseFloat(allPercentages2[iteration][top]);
	}
	// console.log(`sum: ${sum}`);
	avgPercentages3[top] = sum / numIterations;
}

// console.log("allFinalVotes:", allFinalVotes);
// console.log();
computedFinalVotes = countVotes(allFinalVotes, weights.length, false);
console.log("computedFinalVotes:", computedFinalVotes);

// console.log();
console.log(`\x1b[0mOption ${computedFinalVotes[0]}: (\x1b[33m${avgPercentages.map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m) (\x1b[33m${avgPercentages.map((sum => value => sum += value)(0)).map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m)`);
console.log(`\x1b[0mOption ${computedFinalVotes[1]}: (\x1b[33m${avgPercentages2.map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m) (\x1b[33m${avgPercentages2.map((sum => value => sum += value)(0)).map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m)`);
console.log(`\x1b[0mOption ${computedFinalVotes[2]}: (\x1b[33m${avgPercentages3.map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m) (\x1b[33m${avgPercentages3.map((sum => value => sum += value)(0)).map(value => value.toFixed(2)).join('%\x1b[0m, \x1b[33m')}%\x1b[0m)`);



// var csv = votes.map(voter => voter.join(',')).join('\n');

// fs.writeFile('votes.csv', csv, function (err) {
// 	if (err) return console.log(err);
// 	console.log('votes.csv written');
// });