import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  Typography,
  Card,
  TabPanel,
} from "@material-tailwind/react";
import Chat from "@/app/chat/components/Chat";
import LoadingWrapper from "@/app/loading/components/LoadingWrapper";
import LoadingChatBotMessage from "@/app/chat/components/LoadingChatBotMessage";
import ChatBotMessage from "@/app/chat/components/ChatBotMessage";
import StreetView from "@/app/map/StreetView";
import useSpecificTranslation from "@/app/translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "@/app/translation/hooks/useCurrentLanguage";

const AdditionalDetails = ({ selectedNeighborhood }) => {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();

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
      ...message,
      data: message,
      state: "received",
    });
  };

  const nav = [
    {
      label: translate("text55", currentLanguage),
      value: "ai_chat",
      desc: (
        <div className="mx-auto w-full lg:w-[50%]">
          <Typography
            variant="h3"
            className=" text-center mb-4 text-2xl md:text-3xl"
          >
            {translate("text52", currentLanguage)}
          </Typography>
          <Card className=" p-4">
            <Chat
              askedQuestion={askedBotQuestionHandler}
              receivedResponse={receivedBotResponseHandler}
              neighbourhood={selectedNeighborhood}
            />
          </Card>
          <LoadingWrapper
            status={botMessage.state}
            loadingComponent={<LoadingChatBotMessage />}
            finishedComponent={<ChatBotMessage botMessage={botMessage.data} />}
          />
        </div>
      ),
    },
    {
      label: translate("text54", currentLanguage),
      value: "view_neighborhood",
      desc: (
        <div className="mx-auto xl:w-[900px]">
          <Typography variant="h3" className=" text-center">
            {translate("text53", currentLanguage)}
          </Typography>
          <Card className=" p-4 flex flex-col gap-4 h-[350px] md:h-[700px]">
            <StreetView
              key={selectedNeighborhood}
              neighborhood={selectedNeighborhood}
            />
          </Card>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState("ai_chat");

  return (
    <Tabs value={activeTab} orientation="horizontal">
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 mb-6 tablet-xl:w-[50%] w-full mx-auto flex justify-center items-center"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
      >
        {nav.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-gray-900" : ""}
          >
            <div className=" mt-4">{label}</div>
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {nav.map(({ value, desc }) => (
          <TabPanel
            key={value}
            value={value}
            className="py-0 p-0 tablet-sm-s:p-4"
          >
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default AdditionalDetails;
