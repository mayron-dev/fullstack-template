import { Usecase, UseCaseResponse } from "../usecase";
import { z, ZodError } from "zod";

export const organizationSchema = z.object({
  id: z.string().uuid("ID inválido"),
  active: z.boolean(),
  planCode: z.string().optional(),
});
type OrganizationResponse = z.infer<typeof organizationSchema>;

export class GetOrganizationUseCase extends Usecase<undefined, OrganizationResponse> {
  constructor(serverUrl: string) {
    super(serverUrl)
  }
  async execute(): Promise<UseCaseResponse<OrganizationResponse>> {
    try {
      const response = await fetch(`${this.serverUrl}/organization/all`, {
        method: 'GET',
      });
      const data = await response.json();
      const parsedData = organizationSchema.parse(data.organizations);
      return { data: parsedData, success: true };
    } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.issues[0].message, success: false };
      }
      return { error: (error as Error).message, success: false };
    }
  }

}