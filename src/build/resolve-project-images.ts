import { Node, CreateResolversArgs } from "gatsby";

// Note: these types are in-exact since there aren't official TypeScript types
type ResolverContext = {
  nodeModel: {
    getNodeById: (arg: { id: string; type?: string }) => Promise<Node | null>;
    findOne: (arg: {
      type: string;
      query?: Record<string, unknown>;
    }) => Promise<Node | null>;
  };
};

// Note: these types are in-exact since there aren't official TypeScript types
type Resolver<Input, Output> = (
  source: Node,
  input: Input,
  context: ResolverContext,
  info: unknown
) => Promise<Output | null>;

/**
 * Creates a resolver function for a project image file
 * (with the given name).
 * This is defined as an image (svg/png/jpg/jpeg) file
 * in the root project directory (i.e. /projects/<slug>/)
 * that has the given name.
 */
function createProjectImageResolver(name: string): Resolver<never, Node> {
  return async (
    source: Node,
    _input: never,
    context: ResolverContext
  ): Promise<Node | null> => {
    if (source.parent == null) return null;
    const parentFileNode = await context.nodeModel.getNodeById({
      id: source.parent,
      type: "File",
    });
    if (parentFileNode == null) return null;

    const { relativeDirectory, sourceInstanceName } =
      parentFileNode as unknown as {
        relativeDirectory?: string | null;
        sourceInstanceName?: string | null;
      };
    if (sourceInstanceName == null || relativeDirectory == null) return null;

    // If the source instance name isn't projects,
    // or if the relative directory contains slashes,
    // then this isn't a project page (so exit early):
    if (sourceInstanceName !== "projects") return null;
    if (relativeDirectory.includes("/")) return null;

    // Find the matching File node based on the relativeDirectory
    return context.nodeModel.findOne({
      type: "File",
      query: {
        filter: {
          name: { eq: name },
          extension: { in: ["svg", "png", "jpg", "jpeg"] },
          relativeDirectory: { eq: relativeDirectory },
          sourceInstanceName: { eq: "projects" },
        },
      },
    });
  };
}

/**
 * This creates resolvers for the logo and card images,
 * resolving to the file nodes for each image.
 * This essentially acts as a lazy way to link project MDX nodes
 * with their corresponding logo and card images,
 * allowing us to easily get the logo and card for a project
 * once we have queried for its MDX node (using childImageSharp).
 */
export function createProjectImageResolvers(
  createResolvers: CreateResolversArgs["createResolvers"]
): void {
  createResolvers({
    Mdx: {
      logo: {
        resolve: createProjectImageResolver("logo"),
      },
      card: {
        resolve: createProjectImageResolver("card"),
      },
    },
  });
}
