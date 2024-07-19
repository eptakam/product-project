export default function UserIdPage(props) {
  const { userId } = props;

   return (
      <h1>{userId}</h1>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const userId = params.uid;

  return {
    props: {
      userId: "userID-" + userId,
    },
  };
}