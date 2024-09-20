import { run } from "@codejamboree/js-test";
import { logger } from '@codejamboree/js-logger';

const main = async () =>
  await run({
    folderPath: 'build/src',
    testFilePattern: /([xf]_)?(.*)\.test\.js$/,
    testFileReplacement: '$2',
    timeoutMs: 5,
    failFast: true,
    randomOrder: true,
    beforeEach: () => logger.restore(),
    afterEach: () => logger.attach()
  });

try {
  logger.title('Test');
  logger.attach();
  main()
    .then(() => {
      console.info('test run completed.');
    })
    .catch(logger.logError)
    .finally(() => {
      logger.done();
    });
} catch (e) {
  logger.logError(e);
  logger.done();
}
