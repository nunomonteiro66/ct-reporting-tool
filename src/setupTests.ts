import '@testing-library/jest-dom';
import { jestPreviewConfigure } from 'jest-preview';
// TODO: To add your global css here
//import './index.css';

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});
