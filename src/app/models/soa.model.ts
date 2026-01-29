export interface Soa {
  soaNo: string;
  date: string;
  name: string;
  address: string;
  type: 'New' | 'Ren' | 'CO' | 'CV' | 'Mod' | 'ROC';
  particulars: string;
  periodCovered: string;
  sections: {
    title: string;
    rows: [string, number][];
  }[];
}
