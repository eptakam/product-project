export default function UserProfilePage(props) {
  const { username } = props;

  return (
    <h1>{username}</h1>
  );
} 

export async function getServerSideProps(context){
  return {
    props: {
      username: 'Emma'
    }
  }
}