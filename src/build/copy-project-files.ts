import { Node, Reporter } from "gatsby";
import * as pathLib from "path";
import * as fsExtra from "fs-extra";

// Destination folder, relative to root
const destination = "public";
// node.sourceInstanceName allowlist
const allowedSourceInstances = ["projects"];
// node.extension denylist
const disallowedExtensions = ["mdx"];
// custom denylist filters
const imageExtensions = ["jpg", "jpeg", "png", "svg"];
const disallowedImages = ["card", "logo", "icon"];
const disallowedFilters: ((args: {
  name: string;
  ext: string;
  path: string;
}) => boolean)[] = [
  ({ name, ext }): boolean =>
    imageExtensions.includes(ext) && disallowedImages.includes(name),
  ({ path }): boolean => path.search("local") !== -1,
];
// Current file count
let processedFiles = 0;
let successFiles = 0;

/**
 * Hooks into file node creation events
 * to copy static project files (files in /projects/<slug>)
 * that aren't:
 * - a markdown file (these get actual pages generated)
 * - card.{png,svg,jpg,jpeg} or logo.{png,svg,jpg,jpeg},
 *   since these are used in the project cards
 *   and are included via Gatsby publicURL/gatsby-plugin-image mechanisms
 *   (once they are queried using GraphQL)
 * - any files in /projects/<slug>/local/**
 *   (technically any path with "local" in it because that was easier),
 *   which is designed to be a general-purpose "opt-out"
 */
export function onFileCreated({
  node,
  reporter,
}: {
  node: Node;
  reporter: Reporter;
}): void {
  const name: string = node.name as string;
  const extension: string = node.extension as string;
  const relativePath: string = node.relativePath as string;
  const absolutePath: string = node.absolutePath as string;
  const sourceInstanceName: string = node.sourceInstanceName as string;

  // Allowlist by source instance name & denylist by extension/filters
  if (
    allowedSourceInstances.includes(sourceInstanceName) &&
    !disallowedExtensions.includes(extension) &&
    !disallowedFilters.some((func) =>
      func({ name, ext: extension, path: relativePath })
    )
  ) {
    // Copy file
    const newPath = pathLib.join(
      process.cwd(),
      destination,
      sourceInstanceName,
      relativePath
    );
    processedFiles += 1;
    successFiles += 1;
    reporter.info(`copying static project file at /projects/${relativePath}`);
    fsExtra.copy(absolutePath, newPath, (err) => {
      if (err) {
        successFiles -= 1;
        reporter.error(
          `ocurred while copying static project file: ${err.toString()}`
        );
      }
    });
  }
}

/**
 * Hook called some time after node creation has ended
 * to report on the status of the static project file copy operation.
 */
export function postCopyProjectFiles(reporter: Reporter): void {
  reporter.success(
    `copied (${successFiles}/${processedFiles}) static project files`
  );
}
