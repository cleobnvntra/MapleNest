const LoadingWrapper = ({loadingComponent, finishedComponent, status}) => {
    if (status === "sent") {
      return loadingComponent;
    } else if (status === "received") {
      return finishedComponent;
    }
  
    return null;
  };
  
  export default LoadingWrapper;
  