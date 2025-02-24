export type TrackedObjectStruct = {
	row: number,
	link: string,
};

export type CrawledDataStruct = TrackedObjectStruct & {
	groupName: string,
	memberCount: string,
	newPostLastMonth: string,
};

export type ExcelLinkStruct = {
	text: string,
	hyperlink: string;
};

export function isExcelLinkStruct(obj: any): obj is ExcelLinkStruct {
	return (obj as ExcelLinkStruct).text !== undefined && (obj as ExcelLinkStruct).hyperlink !== undefined;
}
