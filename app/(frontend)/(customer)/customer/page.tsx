import { logout } from '@/app/(auth)/auth/actions';

const CustomerPage = () => {
  return (
    <div>
      CustomerPage
      <form action={logout}>
        <button type="submit"> Logout</button>
      </form>
    </div>
  );
};

export default CustomerPage;
