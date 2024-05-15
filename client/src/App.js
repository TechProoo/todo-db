import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";
import ProgressBar from "./components/ProgressBar";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.email
  const [tasks, setTask] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/todo/${userEmail}`);
      const json = await response.json();
      setTask(json);
    } catch (err) {
      console.log(err);
    }
  };

  //SORT BY DATE
  const sortedTask = tasks?.sort((a, b) => a.id - b.id);

  useEffect(() => {
    if(authToken) {
      getData()
    }
  }, []);

  return (
    <div className="app"> 
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader getData={getData} listName={"Holiday tick list"} />
          <p className="usm">Welcome back {userEmail}</p>
          {sortedTask?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
      <p className="cpy">© TechPRO Programming</p>
    </div>
  );
};

export default App;
