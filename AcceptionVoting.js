// scaleTP = Tradition vs. Progressive
// scaleIC = Individualism vs. Collectivism
// scaleGN = Globalization vs. Nationalism
// scaleRA = Regulation vs. Anarchy
// scaleFD = Force vs. Diplomacy
// scaleMS = Mediation vs. Solitude


// votes[vote[processVote(scale)]]

function getScale() {
	return {
		"TP": Math.random() * maxScale,
		"IC": Math.random() * maxScale,
		"GN": Math.random() * maxScale,
		"RA": Math.random() * maxScale,
		"FD": Math.random() * maxScale,
		"MS": Math.random() * maxScale
	};
}

function getDist(scale1, scale2) {
	let sum = 0;
	for (let key in scale1) {
		sum += Math.pow(scale1[key] - scale2[key],2);
	}
	return Math.sqrt(sum);
}

function processVote(scale, candidate) {
	let distance = getDist(scale,candidate);
	// console.log("distance:", distance);
	return Math.round(((maxDist-distance)/maxDist) * 10);
}

function getVotes(numVoters, candidates) {
	let votes = Array.from({ length: numVoters }, () => {
		let scale = getScale();
		// console.log("scale:", scale);
		return Array.from({ length: candidates.length }, (el, index) => {
			return processVote(scale, candidates[index]);
		});
	});
	return votes;
}

function getCandadites(numCandidates) {
	return Array.from({ length: numCandidates }, () => getScale());
}

function countVotes(votes) {
	let voteCounts = Array.from({ length: votes[0].length }, () => 0);
	votes.forEach(vote => {
		vote.forEach((choice, index) => {
			voteCounts[index] += choice;
		});
	});
	return voteCounts;
}

function getWinner(voteCounts) {
	let max = Math.max(...voteCounts);
	let winners = [];
	voteCounts.forEach((count, index) => {
		if (count == max) {
			winners.push(index);
		}
	});
	return winners;
}

const maxScale = 1;
const maxDist = getDist({"TP":0,"IC":0,"GN":0,"RA":0,"FD":0,"MS":0},{"TP":maxScale,"IC":maxScale,"GN":maxScale,"RA":maxScale,"FD":maxScale,"MS":maxScale});


let numVoters = 100;
let numCandidates = 5;

let candidates = getCandadites(numCandidates);
console.log("candidates:", candidates);
let votes = getVotes(numVoters, candidates);
// console.log("votes:", votes);
let voteCounts = countVotes(votes);
console.log("voteCounts:", voteCounts);
let winner = getWinner(voteCounts);

console.log("winner:", winner);

// console.log("maxDist:", maxDist);

console.log(voteCounts.map((count, index) => {
	return count/numVoters;
}));


