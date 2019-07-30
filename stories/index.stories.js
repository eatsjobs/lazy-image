import { storiesOf, html, withKnobs, withClassPropertiesKnobs } from '@open-wc/demoing-storybook';

import { LazyImage } from '../src/LazyImage.js';
import '../lazy-image.js';

storiesOf('lazy-image', module)
  .addDecorator(withKnobs)
  .add('Documentation', () => withClassPropertiesKnobs(LazyImage))
  .add(
    'Test  ',
    () => html`
      <lazy-image 
        src='https://placeimg.com/640/480/any'
        naturalHeight="480" 
        naturalWidth="640"
        alt="alternative text"
        style='width: 50%'>
      </lazy-image>
    `,
  );
