import api from "@/lib/axios";

export interface ChurchSettings {
    _id?: string;
    churchName: string;
    logo: string;
    address: string;
    phone: string;
    currency: string;
    reportFooter: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface SettingsResponse {
    success: boolean;
    message: string;
    data: {
        settings: ChurchSettings;
    };
}

const churchSettingsService = {
    async getSettings(): Promise<ChurchSettings> {
        const response =
            await api.get<SettingsResponse>(
                "/church-settings"
            );

        return response.data.data.settings;
    },

    async updateSettings(
        settings: Partial<ChurchSettings>
    ): Promise<ChurchSettings> {
        const response =
            await api.put<SettingsResponse>(
                "/church-settings",
                settings
            );

        return response.data.data.settings;
    },

    async uploadLogo(
        file: File
    ): Promise<ChurchSettings> {
        const formData = new FormData();

        formData.append("logo", file);

        const response =
            await api.post<SettingsResponse>(
                "/church-settings/logo",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

        return response.data.data.settings;
    },

    async removeLogo(): Promise<ChurchSettings> {
        const response =
            await api.delete<SettingsResponse>(
                "/church-settings/logo"
            );

        return response.data.data.settings;
    },
};

export default churchSettingsService;