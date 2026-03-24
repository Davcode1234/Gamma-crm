const handleCopy = (textToCopy, setIsCopied) => {
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
    });
};

export default handleCopy;
