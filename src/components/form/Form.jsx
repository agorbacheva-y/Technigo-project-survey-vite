import { useState } from "react";
import Radio from "./Radio";
import Dropdown from "./Dropdown";
import Text from "./Text";
import Summary from "./Summary";
import ProgressBar from "./ProgressBar";
import Slider from "./Slider";
import "./Form.css";
import data from "../../data.json";

const Form = () => {
  const fortuneData = data.fortunes;
  const questionData = data.questions;

  // State for which question is displayed
  const [counter, setCounter] = useState(0);

  // State for holding form data
  const [formData, setFormData] = useState({ fortuneNumber: 0 });

  // State for holding questions
  const [questions, setQuestions] = useState([]);

  // State for showing summary
  const [showSummary, setShowSummary] = useState(false);

  // State for showing questions
  const [showQuestions, setShowQuestions] = useState(true);

  // State for if input is filled or not
  const [inputFilled, setInputFilled] = useState(false);

  // State for if last question is filled or not
  const [allFilled, setAllFilled] = useState(false);

  // Function to update form
  const updateForm = (field, value) => {
    setFormData((values) => ({ ...values, [field]: value }));
    
    if (formData.fortuneNumber != 0) {
      setInputFilled(true);
    }
  };

  // Function for prev button
  const handlePrev = () => {
    if (counter > 0) {
      setCounter((counter) => counter - 1);
    } else {
      setCounter(0);
    }
  };

  // Function for next button (Updated to not go out of bounds)
  const handleNext = () => {
    if (counter < questions.length - 1) {
      setCounter((counter) => counter + 1);
    } else {
      setCounter(questions.length - 1);
    }

    setInputFilled(false);
    allInputFilled();
  };

  // Function to check if last question was answered
  const allInputFilled = () => {
    if (Object.keys(formData).length - 1 === questionData.length + 2) {
      setAllFilled(true);
    }
  };

  // Function for showing summary on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setCounter(questions.length);
    setShowSummary(!showSummary);
    setShowQuestions(!showQuestions);
  };

  // Function for survey questions (Maybe move to another file/component?)
  const selectQuestion = () => {
    if (counter >= questions.length) {
      return <></>
    }
    switch (questions[counter].type) {
      case "text":
        return (
          <Text value={counter} formData={formData} updateForm={updateForm}>
            {questions[counter].question}
          </Text>
        );
      case "radio":
        return (
          <Radio
            options={questions[counter].options}
            value={counter}
            formData={formData}
            updateForm={updateForm}
          >
            {questions[counter].question}
          </Radio>
        );
      case "dropdown":
        return (
          <Dropdown
            options={questions[counter].options}
            value={counter}
            formData={formData}
            updateForm={updateForm}
          >
            {questions[counter].question}
          </Dropdown>
        );
      case "slider":
        return (
          <Slider
            value={counter}
            min={questions[counter].min}
            max={questions[counter].max}
            formData={formData}
            updateForm={updateForm}
          >
            {questions[counter].question}
          </Slider>
        );
      default:
        return (
          <p>
            Invalid question data.
            <br />
            Please skip.
          </p>
        );
    }
  };

  const generateQuestions = () => {
    fortuneData[formData.fortuneNumber - 1].values.forEach((value) =>
      questions.push(questionData.find((question) => question.value === value))
    );
  };

  return (
    <>
      {formData.fortuneNumber === 0 ? (
        <div className="form fortune__number">
          <Radio
            options={Array.from(
              { length: fortuneData.length },
              (e, i) => i + 1
            )}
            value={"fortuneNumber"}
            formData={formData}
            updateForm={updateForm}
          >
            Please select a fortune number!
          </Radio>
        </div>
        ) : (
        <>
          {questions.length <= 0 && generateQuestions()}
          <ProgressBar counter={counter} length={questions.length} />
          <div className={showQuestions ? "form" : "hidden"}>
            {selectQuestion()}
            <div className="buttons">
              <button onClick={handlePrev}>Previous</button>
              <button disabled={inputFilled ? false : true } onClick={handleNext}>Next</button>
            </div>

            <button className={allFilled ? "submitBtn" : "hidden"} onClick={handleSubmit} >Submit</button>
          </div>
        </>
        )
      }

      {showSummary && (
        <Summary
          formData={formData}
          setFormData={setFormData}
          setCounter={setCounter}
          setShowQuestions={setShowQuestions}
          setShowSummary={setShowSummary}
          updateForm={updateForm}
          fortuneData={fortuneData}
          setAllFilled={setAllFilled}
        />
      )}
    </>
  );
};

export default Form;
