import { FigmaExport } from '@figma-export/types';

import fs = require('fs');
import path = require('path');
import makeDir = require('make-dir');

type Options = {
    output: string;
    getDirname?: (options: FigmaExport.OutputterParamOption) => string;
    getBasename?: (options: FigmaExport.OutputterParamOption) => string;
}

export = ({
    output,
    getDirname = (options): string => `${options.pageName}${path.sep}${options.dirname}`,
    getBasename = (options): string => `${options.basename}.svg`,
}: Options): FigmaExport.Outputter => {
    return async (pages): Promise<void> => {
        pages.forEach(({ name: pageName, components }) => {
            components.forEach(({ name: componentName, svg, figmaExport }) => {
                const options = {
                    pageName,
                    componentName,
                    ...figmaExport,
                };

                const filePath = makeDir.sync(path.resolve(output, getDirname(options)));
                fs.writeFileSync(path.resolve(filePath, getBasename(options)), svg);
            });
        });
    };
};
