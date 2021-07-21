interface CreateSong {
  body: {
    title: string;
    artist: string;
    playDuration: string;
  };
}

export default CreateSong;
