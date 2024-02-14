const supabase = require("./config");

const supabaseService = {
	upsertTracking: async (dataToUpsert) => {
		try {
			const { data, error } = await supabase
				.from("Tracking")
				.upsert(dataToUpsert, { onConflict: "hbl" })
				.select("*");

			return { data, error };
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = supabaseService;
