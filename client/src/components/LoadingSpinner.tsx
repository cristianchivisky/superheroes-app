import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ loading }: { loading: boolean }) => (
  <div className="flex justify-center items-center min-h-screen">
    <ClipLoader loading={loading} size={70} />
  </div>
);

export default LoadingSpinner;