interface AddPerformance {
  body: {
    singerId: string;
    songId: string;
    songTitle: string;
    artist: string;
    performanceDate: string;
  };
}

export default AddPerformance;
