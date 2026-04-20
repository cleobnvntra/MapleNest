import React from "react";
import Animate from "@/app/loading/components/Animate";
import { Card, Typography } from "@material-tailwind/react";
import useSpecificTranslation from "@/app/translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "@/app/translation/hooks/useCurrentLanguage";

const ChatBotMessage = ({ botMessage }) => {
  const currentLanguage = useCurrentLanguage();
  const translate = useSpecificTranslation();

  return (
    <Animate key={2}>
      {botMessage && (
        <Card className=" p-4 mt-4 mx-auto">
          <div className=" flex gap-4 flex-col">
            <div className="flex-shrink-0 flex items-center">
              <img src={"/image.png"} className="w-12 h-12 rounded-lg mr-4" />
              <Typography variant="h6" color="blue-gray">
                {`Maple Nest ${translate("text38", currentLanguage)}`}
              </Typography>
            </div>
            <div>
              <Typography
                variant="paragraph"
                color="gray"
                className="font-normal"
              >
                {botMessage}
              </Typography>
            </div>
          </div>
        </Card>
      )}
    </Animate>
  );
};

export default ChatBotMessage;
