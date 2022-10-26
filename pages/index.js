import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image: "https://cdn-0.generatormix.com/images/europe-city/bruges.jpg",
    address: "123 earth road",
    description: "First meetup description",
  },
  {
    id: "m2",
    title: "A Second Meetup",
    image: "https://cdn-0.generatormix.com/images/europe-city/bruges.jpg",
    address: "123 universe island",
    description: "Second meetup description",
  },
];

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>REACT MEETUPS</title>
        <meta
          name="description"
          content="Browse a huge list of React Meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

//to generate for every incoming request
// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;
//     //fetch data from an api
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //fetch data from an api
  const client = await MongoClient.connect(
    "mongodb+srv://Zali:zali01101996@cluster0.llyz7hw.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  console.log("mongodb is connected");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  console.log("meetups:", meetups);

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, //number of seconds it takes to regenerate page on the server
  };
}

export default HomePage;
