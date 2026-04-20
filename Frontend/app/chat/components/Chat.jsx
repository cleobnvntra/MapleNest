import { useState } from "react";
import {
  Button,
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import getAPIUrl from "../../utils/getAPIUrl";
import useSpecificTranslation from "@/app/translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "@/app/translation/hooks/useCurrentLanguage";

const Chat = ({
  neighbourhood,
  neighbourhood2,
  receivedResponse,
  askedQuestion,
}) => {
  const currentLanguage = useCurrentLanguage();
  const translate = useSpecificTranslation();
  const [userPrompt, setUserPrompt] = useState("");

  const messageSentHandler = () => {
    setUserPrompt("");
    askedQuestion();

    const isSingleNeighbourhoodQuestion =
      !neighbourhood2 || neighbourhood == neighbourhood2;

    const userMessage = isSingleNeighbourhoodQuestion
      ? {
          prompt: userPrompt,
          lang: currentLanguage,
          neighbourhood: neighbourhood,
        }
      : {
          prompt: userPrompt,
          lang: currentLanguage,
          neighbourhood1: neighbourhood,
          neighbourhood2: neighbourhood2,
        };

        console.log(currentLanguage);
    console.log(userMessage);

    const slug = isSingleNeighbourhoodQuestion ? "/chat" : "/chat/compare";

    fetch(`${getAPIUrl()}${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMessage),
    })
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        receivedResponse(text);
      });
  };

  return (
    <div className=" flex flex-col gap-4 h-full w-full">
      <div className=" flex gap-4 justify-between items-center">
        <Button
          className=" self-center py-2 w-full text-base"
          onClick={messageSentHandler}
        >
          {translate("button2", currentLanguage)}
        </Button>
      </div>

      <div className=" flex justify-between gap-4">
        <Textarea
          id="chatFocus"
          label={translate("text27", currentLanguage)}
          value={userPrompt}
          onChange={(e) => {
            const code = e.keyCode ? e.keyCode : e.which;
            if (code == 13) {
              setUserPrompt("");
              alert("enter press");
            } else {
              setUserPrompt(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

const Message = ({ imgSrc, message, name }) => {
  return (
    <ListItem className="max-w-full">
      <ListItemPrefix>
        <Avatar variant="circular" alt="image" src={imgSrc} />
      </ListItemPrefix>
      <div>
        <Typography variant="h6" color="blue-gray">
          {name}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {message}
        </Typography>
      </div>
    </ListItem>
  );
};

export default Chat;
