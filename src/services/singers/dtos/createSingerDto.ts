interface CreateSinger {
  body: {
    firstName: string;
    lastName: string;
    stageName: string;
    email: string;
  };
}

export default CreateSinger;
