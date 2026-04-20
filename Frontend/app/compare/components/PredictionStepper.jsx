import { useState } from "react";
import { Stepper, Step, Card, Typography } from "@material-tailwind/react";
import CompareStats from "./CompareStats";
import { FaThList } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { SiGooglemaps } from "react-icons/si";
import CompareImages from "./CompareImages";
import CompareStreetViews from "./CompareStreetViews";
import ChatBotMessage from "@/app/chat/components/ChatBotMessage";
import LoadingChatBotMessage from "@/app/chat/components/LoadingChatBotMessage";
import Chat from "@/app/chat/components/Chat";
import LoadingWrapper from "@/app/loading/components/LoadingWrapper";
import useSpecificTranslation from "@/app/translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "@/app/translation/hooks/useCurrentLanguage";

const PredictionStepper = ({ stats }) => {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();

  const [activeStep, setActiveStep] = useState(0);
  const [botMessage, setBotMessage] = useState({
    state: "chilling",
    data: null,
  });

  const askedBotQuestionHandler = () => {
    setBotMessage({
      ...botMessage,
      state: "sent",
    });
  };

  const receivedBotResponseHandler = (message) => {
    setBotMessage({
      data: message,
      state: "received",
    });
  };

  const steps = [
    <div className=" flex flex-col gap-4">
      <CompareStats stats={stats.data} displayData={stats.displayData} />
    </div>,
    <div className="2xl:h-[800px] !tablet-xl:h-[400px] h-[600px] ">
      <CompareImages displayData={stats.displayData} />
    </div>,
    <div className="2xl:h-[800px] !tablet-xl:h-[400px] h-[600px]">
      <CompareStreetViews displayData={stats.displayData} />
    </div>,
  ];

  return (
    <div className=" w-full flex flex-col gap-5 pt-5">
      <div className="w-full tablet-xl:px-24 md:py-4">
        <Stepper activeStep={activeStep}>
          <Step onClick={() => setActiveStep(0)} className="hover:cursor-pointer">
            <FaThList className="h-5 w-5" />
          </Step>
          <Step onClick={() => setActiveStep(1)} className="hover:cursor-pointer">
            <FaImage className="h-5 w-5" />
          </Step>
          <Step onClick={() => setActiveStep(2)} className="hover:cursor-pointer">
            <SiGooglemaps className="h-5 w-5" />
          </Step>
        </Stepper>
      </div>
      <div className=" w-full">{steps[activeStep]}</div>
      <div className="w-full tablet-xl:px-24 md:py-4">
        <Stepper activeStep={activeStep}>
          <Step onClick={() => setActiveStep(0)} className="hover:cursor-pointer">
            <FaThList className="h-5 w-5" />
          </Step>
          <Step onClick={() => setActiveStep(1)} className="hover:cursor-pointer">
            <FaImage className="h-5 w-5" />
          </Step>
          <Step onClick={() => setActiveStep(2)} className="hover:cursor-pointer">
            <SiGooglemaps className="h-5 w-5" />
          </Step>
        </Stepper>
      </div>
      {activeStep == 0 && (
        <div className=" mx-auto lg:w-[50%] mt-4">
          <Typography variant="h3" className=" text-center mb-4 text-2xl md:text-3xl">
          {translate("text52", currentLanguage)}
          </Typography>
          <Card className=" p-4">
            <Chat
              askedQuestion={askedBotQuestionHandler}
              receivedResponse={receivedBotResponseHandler}
              neighbourhood={stats.displayData.neighbourhood1}
              neighbourhood2={stats.displayData.neighbourhood2}
            />
          </Card>
          <LoadingWrapper
            status={botMessage.state}
            loadingComponent={<LoadingChatBotMessage />}
            finishedComponent={<ChatBotMessage botMessage={botMessage.data} />}
          />
        </div>
      )}
    </div>
  );
};

export default PredictionStepper;
