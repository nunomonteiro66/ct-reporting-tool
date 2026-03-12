import CTLoadingSpinner from '@commercetools-uikit/loading-spinner';
import './styles.css';

type LoadingSpinnerProps = {
  scale?: 'S' | 'M' | 'L';
};

const LoadingSpinner = ({ scale = 'M' }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner scale-${scale}`}>
      <CTLoadingSpinner></CTLoadingSpinner>
    </div>
  );
};

export default LoadingSpinner;
