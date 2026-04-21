//Movie Recommendation Logic
//Uses content-based similarity on Genre and Rating
const genreMap={
  "Action": 1,
  "Adventure": 2,
  "Animation": 3,
  "Comedy": 4,
  "Crime": 5,
  "Drama": 6,
  "Fantasy": 7,
  "Horror": 8,
  "Mystery": 9,
  "Romance": 10,
  "Sci-Fi": 11,
  "Thriller": 12,
  "War": 13
};
function normalizeRating(rating){
  return rating/10; //Ratings are out of 10
}
function getFeatureVector(movie){
  return [
    genreMap[movie.genre] || 0,
    normalizeRating(movie.rating)
  ];  //Normalize to 0–1
}

function calculateDistance(vec1,vec2){
  let sum=0;
  for(let i=0;i<vec1.length;i++){
    sum+=Math.pow(vec1[i]-vec2[i],2);
  }
  return Math.sqrt(sum);
}

function getRecommendations(selectedMovieTitle){
  const selectedMovie = movies.find(movie => movie.title === selectedMovieTitle);
  if (!selectedMovie) return [];

  const selectedVector = getFeatureVector(selectedMovie);
  const distances = movies.filter(movie => movie.title !== selectedMovieTitle).map(movie => {
      return {
        ...movie,
        distance: calculateDistance(selectedVector, getFeatureVector(movie))
      };
    });

  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, 4);
}
