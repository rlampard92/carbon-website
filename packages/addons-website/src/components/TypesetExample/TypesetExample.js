import React from 'react';
import { settings } from 'carbon-components';
import classnames from 'classnames';
import { findKey, values } from 'lodash';
import { baseFontSize, breakpoints as carbonBreakpoints } from '@carbon/layout';
import { CodeSnippet } from 'carbon-components-react';

const { prefix } = settings;

const breakpoints = {
  sm: Number(carbonBreakpoints.sm.width.replace('rem', '')) * baseFontSize,
  md: Number(carbonBreakpoints.md.width.replace('rem', '')) * baseFontSize,
  lg: Number(carbonBreakpoints.lg.width.replace('rem', '')) * baseFontSize,
  xlg: Number(carbonBreakpoints.xlg.width.replace('rem', '')) * baseFontSize,
  max: Number(carbonBreakpoints.max.width.replace('rem', '')) * baseFontSize,
};

const defaultTypeValues = {
  'letter-spacing': 0,
};

const TypesetExample = props => {
  return (
    <div className={`${prefix}--typeset-example-container`}>
      {(props.typeSet || []).map(type => {
        const indexOfClosestLargerBreakpoint = Math.max(
          0,
          values(breakpoints).findIndex(
            width => props.simulatedScreenWidth <= width
          )
        );

        const currentBreakpointPx = values(breakpoints)[
          indexOfClosestLargerBreakpoint
        ];

        const nextLargerBreakpointPx = values(breakpoints)[
          indexOfClosestLargerBreakpoint - 1
        ];

        const currentBreakpointName = findKey(
          breakpoints,
          val => val === currentBreakpointPx
        );
        const nextLargerBreakpointName = findKey(
          breakpoints,
          val => val === nextLargerBreakpointPx
        );

        const getCurrentCompoundStylesForBreakpoint = breakpointName => {
          const typeKeys = Object.keys(breakpoints);
          const typeStylesUntilCurrentBreakpoint = [];
          for (let item of typeKeys) {
            typeStylesUntilCurrentBreakpoint.push(
              props.typeScale[type.key][item]
            );
            if (item === breakpointName) break;
          }
          return Object.assign(
            {},
            defaultTypeValues,
            ...typeStylesUntilCurrentBreakpoint
          );
        };

        const currentBreakpointSpecs = getCurrentCompoundStylesForBreakpoint(
          currentBreakpointName
        );

        const calculateFluidTypeSize = attribute => {
          return currentBreakpointSpecs[attribute] * baseFontSize;
        };

        const calculateFluidLineHeight = attribute => {
          return currentBreakpointSpecs[attribute] * baseFontSize;
        };

        const displayWeight = (weight, style) => {
          if (style == 'italic') {
            return weight + ' / Italic';
          } else {
            switch (weight) {
              case '300':
                return '300 / Light';
              case '400':
                return '400 / Regular';
              case '600':
                return '600 / Semi-Bold';
              default:
                return weight;
            }
          }
        };

        const specs = {
          fontWeight: currentBreakpointSpecs['font-weight'],
          fontSize: `${calculateFluidTypeSize('font-size')}px`,
          fontStyle: currentBreakpointSpecs['font-style'],
          lineHeight: `${calculateFluidLineHeight('line-height')}px`,
          letterSpacing: currentBreakpointSpecs['letter-spacing'],
        };
        const displaySpecs = {
          step: currentBreakpointSpecs['step'],
          font: currentBreakpointSpecs['font'],
          style: currentBreakpointSpecs['font-style'],
          fontWeight: displayWeight(
            currentBreakpointSpecs['font-weight'],
            currentBreakpointSpecs['font-style']
          ),
          fontSize:
            `${calculateFluidTypeSize('font-size')}px` +
            ' / ' +
            currentBreakpointSpecs['font-size'].toString().replace('0.', '.') +
            `rem`,
          lineHeight:
            `${calculateFluidLineHeight('line-height')}px` +
            ` / ` +
            currentBreakpointSpecs['line-height'] +
            `rem`,
          letterSpacing: currentBreakpointSpecs['letter-spacing'].toString().replace('0.', '.'),
          warning: currentBreakpointSpecs['warning'],
        };

        const versionClassName = type.version
          ? `${prefix}--type-${type.version}`
          : '';

        const versionClassNames = classnames(
          `${prefix}--type-${type.key}`,
          versionClassName
        );

        return (
          <div
            key={`${props.name}${type.key}${type.version}`}
            style={{ padding: 0 }}
            className={`${prefix}--typeset-example`}>
            <div className={`${prefix}--typeset-example-row ${prefix}--row`}>
              <div
                className={`${prefix}--typeset-example-description ${prefix}--col-md-8`}>
                <p className={versionClassNames} style={specs}>
                  {type.description}
                </p>
              </div>
              <div
                className={`${prefix}--typeset-example-specs ${prefix}--col-md-4 ibm-padding`}>
                <span className={`${prefix}--type-body-short-01`}>
                  <span className={`${prefix}--type-semibold`}>
                    {type.name}{' '}
                  </span>
                  <br />
                  Type: {displaySpecs['font']}
                  <br />
                  Size: {displaySpecs['fontSize']}
                  <br />
                  Line-height: {displaySpecs['lineHeight']}
                  <br />
                  Weight:{' '}
                  <span style={{ textTransform: 'capitalize' }}>
                    {displaySpecs['fontWeight']}
                  </span>
                  <br />
                  Letter-spacing: {displaySpecs['letterSpacing']}px
                  {displaySpecs['warning'] != null ? (
                    <span>
                      <br />
                      <span className={`${prefix}--type-semibold`}>
                        warning:{' '}
                      </span>
                      {displaySpecs['warning']}
                      <br />
                    </span>
                  ) : (
                    <br />
                  )}
                  <div className={`${prefix}--typeset-example-code-style`}>
                    <CodeSnippet type="inline">${type.name}</CodeSnippet>
                  </div>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TypesetExample;
