import axios from "axios";
import { useState } from "react";

const Chat = () => {
  const [question, setQuestion] = useState("");
  // 질문 값
  const [content, setContent] = useState("");
  // 결과 값
  const [isLoading, setIsLoading] = useState(false);
  // 중복 요청 방지

  const onSubmitChat = async (e) => {
    try {
      e.preventDefault();

      if (isLoading) {
        alert("검색중입니다...");
        return;
      }

      if (!question) {
        alert("질문을 입력해 주세요.");
        return;
      }

      // 로딩중 = true으로 바꾸고 아래의 요청들이 정상적으로 끝나면 끝나는 지점에서 false로 하단에서 바꿔줌. 에러가 났을 경우도 false 작성해야 함.
      setIsLoading(true);

      setContent("");
      //검색을 시작하면 이전 검색에서 결과값인 content를 초기화 해줌. 값을 받아오면 다시 보여줌.

      const response = await axios.post(
        "https://holy-fire-2749.fly.dev/chat",
        {
          question,
          // question: `${question}`,
          // question: question,     3개는 같은거임 키, 밸류값이 같으면 뒤에 생략가능
        },
        {
          headers: {
            Authorization: "Bearer BLOCKCHAINSCHOOL3",
          },
        }
      );

      if (response.status !== 200) {
        alert("오류가 발생했습니다.");
        // Weather.jsx에서 같읕 부분임. 오류났을 경우
        setIsLoading(false);
        return;
      }

      console.log(response);
      setContent(response.data.choices[0].message.content);

      // 로딩 중 false
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white">
      <form onSubmit={onSubmitChat}>
        <input
          className="text-black"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input type="submit" value="검 색" />
      </form>
      {content && <div className="mt-4 px-16">{content}</div>}
      {/* 왼쪽 오른쪽 값이 있다면! 이라고 해석하면 됨. 왜냐하면 오른쪽은 항상 값이 존재하기 때문임. 같은 content라서 */}
    </div>
  );
};

export default Chat;
