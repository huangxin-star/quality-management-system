import {defineStore} from "pinia";
import {createProposal, getProposalAnalytics, getProposalById, getProposals, updateProposal,} from "@/utils/api";

export const useProposalStore = defineStore("proposal", {
    state: () => ({
        proposals: [],
        currentProposal: null,
        analytics: null,
        loading: false,
        error: null,
    }),
    getters: {
        getProposalById: (state) => (id) => {
            return state.proposals.find((proposal) => proposal.id === id);
        },
    },
    actions: {
        async fetchProposals(params) {
            this.loading = true;
            try {
                const response = await getProposals(params);
                this.proposals = response.data.items;
                this.loading = false;
                return Promise.resolve(response.data);
            } catch (error) {
                this.error = error.message || "Failed to fetch proposals";
                this.loading = false;
                return Promise.reject(error);
            }
        },

        async fetchProposalById(id) {
            this.loading = true;
            try {
                const response = await getProposalById(id);
                this.currentProposal = response.data;
                this.loading = false;
                return Promise.resolve(response.data);
            } catch (error) {
                this.error = error.message || `Failed to fetch proposal with ID ${id}`;
                this.loading = false;
                return Promise.reject(error);
            }
        },

        async submitProposal(proposalData) {
            this.loading = true;
            try {
                const response = await createProposal(proposalData);
                // 添加新创建的提案到列表中
                this.proposals.unshift(response.data);
                this.loading = false;
                return Promise.resolve(response.data);
            } catch (error) {
                this.error = error.message || "Failed to submit proposal";
                this.loading = false;
                return Promise.reject(error);
            }
        },

        // 暂时不用
        async updateProposalStatus(id, status) {
            this.loading = true;
            try {
                const response = await updateProposal(id, {status});
                // 更新本地存储中的提案状态
                const index = this.proposals.findIndex((p) => p.id === id);
                if (index !== -1) {
                    this.proposals[index] = {...this.proposals[index], status};
                }
                if (this.currentProposal && this.currentProposal.id === id) {
                    this.currentProposal = {...this.currentProposal, status};
                }
                this.loading = false;
                return Promise.resolve(response.data);
            } catch (error) {
                this.error = error.message || `Failed to update proposal status`;
                this.loading = false;
                return Promise.reject(error);
            }
        },

        async fetchAnalytics(filters) {
            this.loading = true;
            try {
                const response = await getProposalAnalytics(filters);
                this.analytics = response.data;
                this.loading = false;
                return Promise.resolve(response.data);
            } catch (error) {
                this.error = error.message || "Failed to fetch analytics";
                this.loading = false;
                return Promise.reject(error);
            }
        },
    },
});
