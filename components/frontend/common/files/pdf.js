import { Document, Page, Text, View, Image } from '@react-pdf/renderer';

const PDFCertificate = ({ data }) => {

    return <Document>
        <Page size="letter" orientation="portrait" style={styles.page}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.title}>Certificate</Text>
                    <Text style={styles.subtitle}>OF ACHIEVEMENT</Text>
                    <Text style={styles.recipient}>PROUDLY PRESENTED TO</Text>
                    <Text style={styles.recipientName}>{data.recipient}</Text>
                </View>

                <Text style={styles.description}>{data.description}</Text>

                <View style={styles.footer}>
                    <View style={styles.date}>
                        <Text style={styles.dateText}>{data.date}</Text>
                        <View style={styles.line}></View>
                        <Text style={styles.dateLabel}>Date</Text>
                    </View>
                    <Image style={styles.logo} src={data.logo} alt="logo" />
                    <View style={styles.signature}>
                        <Image style={styles.signatureImage} src={data.signature} alt="signature" />
                        <View style={styles.line}></View>
                        <Text style={styles.signatureLabel}>Signature</Text>
                    </View>
                </View>

            </View>
        </Page>
    </Document>

}

const styles = {
    page: {
        backgroundColor: '#ffffff',
        marginTop: 'auto',

    },
    container: {
        border: '4px solid #314E85',
        margin: 8,
        textAlign: 'center',
    },
    header: {
        borderBottom: '2px solid #314E85',
        paddingBottom: '20px',
        marginTop: '12px',
    },
    title: {
        textTransform: 'uppercase',
        color: '#3A416F',
        fontSize: '48px',
        fontWeight: 'bold',
    },
    subtitle: {
        textTransform: 'uppercase',
        color: '#314E85',
        fontSize: '24px',
        marginTop: '12px',
    },
    recipient: {
        textTransform: 'uppercase',
        color: '#3A416F',
        fontSize: '16px',
        marginTop: '6px',
    },
    recipientName: {
        color: '#314E85',
        fontSize: '48px',
        fontWeight: 'semibold',
        marginTop: '20px',
    },
    description: {
        color: '#3A416F',
        fontSize: '20px',
        marginTop: '20px',
    },
    footer: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: '50px',
        marginBottom: "20px"
    },
    date: {
        textAlign: "center"
    },
    line: {
        borderBottom: "1px solid #3A416F ",
    },
    dateText: {
        color: '#3A416F',
        fontSize: '16px',
        fontWeight: 'medium',
        marginBottom: '10px',
        marginLeft: 'auto',
    },
    dateLabel: {
        textTransform: 'uppercase',
        color: '#3A416F',
        fontSize: '18px',
        marginLeft: '30px',
    },
    logo: {
        height: '90px',
        width: '90px',
    },
    signature: {
        textTransform: 'uppercase',
        color: '#3A416F',
        fontSize: '18px',
    },
    signatureImage: {
        width: '80px',
        height: '30px',
        marginBottom: '10px',
        marginLeft: 'auto',

    }
}
export default PDFCertificate;