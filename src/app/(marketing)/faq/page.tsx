// simple FAQ list

const faqs = [
  { question: 'ssssssssssss', answer: 'eeeeeeeeeeeeeeee' },
  { question: 'ssssssssssss', answer: 'eeeeeeeeeeeeeeee' }
];
interface FaqPropsI {
  question: string;
  answer: string;
}

const Faq = ({ question, answer }: FaqPropsI) => {
  return (
    <div key={question} className="my-8">
      <div className="flex items-center">
        <span className="font-semibold text-lg">{question}</span>
      </div>
      <div className="text-slate-400 text-base font-medium">{answer}</div>
    </div>
  );
};

export default function FAQs() {
  return (
    <div>
      {faqs.map((faq) => (
        <div>
          <Faq answer={faq.answer} question={faq.question} />
        </div>
      ))}
    </div>
  );
}
